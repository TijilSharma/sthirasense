const fetchUSDTSupplyData = async (pool) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=tether&x_cg_demo_api-key=${process.env.COIN_GEKKO_API}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const data = await response.json();
    const coin = data[0];

    // Destructure exactly what we need
    const { 
      last_updated, 
      market_cap, 
      circulating_supply, 
      total_supply, 
      price_change_percentage_24h, 
      market_cap_change_percentage_24h 
    } = coin;

    // 1. Use snake_case to match standard Postgres naming
    // 2. Use $1, $2 to avoid "trailing junk" errors
    const query = `
      INSERT INTO "SUPPLY_USDT" (
        timestamp, 
        circulating_supply, 
        total_supply, 
        market_cap, 
        price_change_24h, 
        market_cap_change_24h
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    const values = [
      last_updated,      // Becomes $1 (The ISO string '2026-02-13T...')
      circulating_supply, // Becomes $2
      total_supply,       // Becomes $3
      market_cap,         // Becomes $4
      price_change_percentage_24h,      // Becomes $5
      market_cap_change_percentage_24h  // Becomes $6
    ];

    await pool.query(query, values);
    console.log(`[Gecko] USDT supply data saved successfully.`);
  } catch (err) {
    console.error('[Gecko Error]:', err.message);
  }
};

export {fetchUSDTSupplyData as fetchCoinData};