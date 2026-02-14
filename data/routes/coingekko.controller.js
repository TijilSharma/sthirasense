const fetchUSDTSupplyData = async (symbol, name, ohlcvData, pool) => {
  // ohlcvData = { opentime, open, high, low, close, volume, closetime }
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${name}&x_cg_demo_api-key=${process.env.COIN_GEKKO_API}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
    const coinData = await response.json();
    if (!coinData || coinData.length === 0) throw new Error("No data from CoinGecko");

    const coin = coinData[0];

    // Destructure only needed fields
    const { 
      last_updated, 
      market_cap, 
      circulating_supply, 
      total_supply, 
      total_volume,            // use as quote_volume
      price_change_percentage_24h, 
      market_cap_change_percentage_24h 
    } = coin;

    const epochTimestamp = Math.floor(new Date(last_updated).getTime() / 1000);

    // Prepare SQL query with all fields your feature engine expects
    const query = `
      INSERT INTO ${symbol} (
        open_time,
        open,
        high,
        low,
        close,
        volume,
        close_time,
        quote_volume,
        trades,
        taker_base,
        taker_quote,
        market_cap,
        circulating_supply,
        total_supply,
        price_change_percentage_24h,
        market_cap_change_percentage_24h
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    `;

    const values = [
      ohlcvData.opentime,                 // $1
      ohlcvData.open,                     // $2
      ohlcvData.high,                     // $3
      ohlcvData.low,                      // $4
      ohlcvData.close,                    // $5
      ohlcvData.volume,                   // $6
      ohlcvData.closetime,                // $7
      total_volume || 0,                  // $8 quote_volume
      null,                               // $9 trades (CoinGecko doesn't provide)
      0,                                  // $10 taker_base (default 0)
      0,                                  // $11 taker_quote (default 0)
      market_cap,                         // $12
      circulating_supply,                 // $13
      total_supply,                       // $14
      price_change_percentage_24h,        // $15
      market_cap_change_percentage_24h    // $16
    ];

    await pool.query(query, values);
    console.log(`[Gecko] USDT + OHLCV + market data saved successfully.`);

  } catch (err) {
    console.error('[Gecko Error]:', err.message);
  }
};

export { fetchUSDTSupplyData };
