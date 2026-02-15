import { pool } from "../../server.js";
import { SendResponse } from "../utils/helper.js";

export const getUSDTController = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM outputs ORDER BY id DESC LIMIT 1");
        return SendResponse(res, 200, true, "Latest USDT data fetched successfully", { data: result.rows[0] });
    }
    catch (err) {
        console.error("Error fetching USDT data:", err);
        return SendResponse(res, 500, false, "Internal Server Error");
    }
};

export const getProfileController = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await pool.query("SELECT username, email FROM users WHERE id = $1", [userId.id]);
        if (result.rows.length === 0) {
            return SendResponse(res, 404, false, "User not found");
        }
        return SendResponse(res, 200, true, "User profile fetched successfully", { profile: result.rows[0] });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        return SendResponse(res, 500, false, "Internal Server Error");
    }
};