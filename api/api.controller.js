import { pool } from "../server.js";

export async function getMarketData(req, res) {
  try {
    const { symbol, interval } = req.params;

    const tableName = `OHCLV${symbol}`;

    const result = await pool.query(
      `SELECT * FROM "${tableName}"
   ORDER BY opentime DESC
   LIMIT 100`
    );

    res.json({
      symbol,
      interval,
      tier: req.apiUser.tier,
      data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
