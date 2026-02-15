const fetchUSDTSupplyData = async (symbol, name, ohlcvData, pool) => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${name}&x_cg_demo_api-key=${process.env.COIN_GEKKO_API}`;

  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`Rate limited (429), attempt ${attempt}`);
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      }

      const coinData = await response.json();
      if (!coinData || coinData.length === 0) throw new Error("No data from CoinGecko");

      const coin = coinData[0];

      const { 
        last_updated, 
        market_cap, 
        circulating_supply, 
        total_supply, 
        total_volume, 
        price_change_percentage_24h, 
        market_cap_change_percentage_24h 
      } = coin;

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
        ohlcvData.opentime,
        ohlcvData.open,
        ohlcvData.high,
        ohlcvData.low,
        ohlcvData.close,
        ohlcvData.volume,
        ohlcvData.closetime,
        total_volume || 0,
        null,
        0,
        0,
        market_cap || 0,
        circulating_supply || 0,
        total_supply || 0,
        price_change_percentage_24h || 0,
        market_cap_change_percentage_24h || 0
      ];

      await pool.query(query, values);
      console.log(`[Gecko] USDT + OHLCV + market data saved successfully.`);
      break; // success, exit retry loop

    } catch (err) {
      console.error(`[Gecko Error]: ${err.message}`);

      if (attempt === MAX_RETRIES) {
        console.error(`[Gecko Error]: Max retries reached. Skipping this symbol.`);
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const waitTime = 1000 * 2 ** (attempt - 1);
      console.log(`[Gecko] Retrying in ${waitTime / 1000}s...`);
      await new Promise(r => setTimeout(r, waitTime));
    }
  }
};

export { fetchUSDTSupplyData };
