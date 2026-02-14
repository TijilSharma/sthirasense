import express from "express";
import crypto from "crypto";
import { pool } from "../../server.js";
import { generateToken } from "../utils/jwt.js";
import { SendResponse } from "../utils/helper.js";
// import dotenv from 'dotenv';

// dotenv.config();

export const googleAuthController = (req, res) => {
  const state = crypto.randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state: state,
    access_type: "offline",
    prompt: "consent",
  });

  // console.log(`Redirecting to Google OAuth with state: ${state}`, process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_REDIRECT_URI);

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const googleAuthVerifier = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;

    // Fetch user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const userData = await userResponse.json();

    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      userData.email,
    ]);

    if (userCheck.rows.length === 0) {
      await pool.query("INSERT INTO users (username, email) VALUES ($1, $2)", [
        userData.name,
        userData.email,
      ]);
      const fetchData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [userData.email],
      );
      const token = generateToken({id:fetchData.rows[0].id});
      return res.redirect(`${process.env.FRONTEND_URL}/api/auth/google/callback?token=${token}`);
    } else {
      const fetchData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [userData.email],
      );
      const token = generateToken({id:fetchData.rows[0].id});
     return res.redirect(`${process.env.FRONTEND_URL}/api/auth/google/callback?token=${token}`);
    }
  } catch (err) {
    console.error(err);
    SendResponse(res, 500, false, "Internal Server Error");
  }
};
