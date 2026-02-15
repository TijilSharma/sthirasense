import { pool } from '../server.js';
import crypto from 'crypto';
import { SendResponse } from '../client/utils/helper.js';

export const apiKeyGenController = async (req, res) => {
    try {
        const userId = "b866928c-2abc-401e-a55a-489018c2ee7e";
        const apiKey = crypto.randomBytes(32).toString('hex');

        await pool.query(
            "INSERT INTO api_keys (user_id, api_key, active) VALUES ($1, $2, true)",
            [userId, apiKey]
        );
        SendResponse(res, 201, "API key generated successfully", { api_key: apiKey });
    } catch (err) {
        console.error("Error generating API key:", err);
        SendResponse(res, 500, "Internal Server Error");
    }
}