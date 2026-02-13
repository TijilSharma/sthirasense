import { pool } from "../server.js";
import { SendResponse } from "../client/utils/helper.js";

export async function apiKeyAuth(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      SendResponse(res, 401, "API key missing");
      return;
    }
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key = $1 AND active = true",
      [apiKey],
    );

    if (result.rows.length === 0) {
      SendResponse(res, 403, "Invalid API key");
      return;
    }
    req.apiUser = result.rows[0];
    next();
  } catch (err) {
    console.error("API Key Auth Error:", err);
    SendResponse(res, 500, "Internal Server Error");
  }
}
