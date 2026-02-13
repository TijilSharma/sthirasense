const fetchUSDTSupplyData = async () => {
  // Use the ID 'tether' for USDT
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether&x_cg_demo_api-key=${process.env.COIN_GEKKO_API}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    // const usdt = data[0]; // The response is an array

    // const query = `
    //   INSERT INTO "SUPPLY_USDT" (timestamp, circulating_supply, total_supply, market_cap)
    //   VALUES (NOW(), $1, $2, $3)
    // `;
    
    // const values = [
    //   usdt.circulating_supply,
    //   usdt.total_supply,
    //   usdt.market_cap
    // ];

    // await pool.query(query, values);
    console.log(data);
    console.log(`[Gecko] USDT supply data saved.`);
  } catch (err) {
    console.error('[Gecko Error]:', err.message);
  }
};

export { fetchUSDTSupplyData as fetchCoinData };