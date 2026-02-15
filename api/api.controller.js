import { pool } from "../server.js";
import { SendResponse } from "../client/utils/helper.js";

export async function   getMarketData(req, res) {
  try {
    const { symbol, interval } = req.params;

    const tableName = `usdt`;

    const result = await pool.query(
      `SELECT * FROM "${tableName}"
   ORDER BY open_time DESC
   LIMIT 100`
    );

    return SendResponse(res, 200, true, "Market data retrieved successfully", {
      symbol,
      interval,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    return SendResponse(res, 500, false, "Server error");
  }
}
