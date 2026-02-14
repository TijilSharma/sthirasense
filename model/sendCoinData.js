export const sendCoinData = async (coin, table, pool) => {
    const result = await pool.query(`SELECT * FROM ${table} ORDER BY open_time DESC LIMIT 1`);
    if (result.rows.length === 0) {
        console.log(`[${coin}] No data found in ${table}. Skipping.`);
        return;
    }
    return result.rows[0];
}