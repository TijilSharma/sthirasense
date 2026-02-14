import express from 'express';
import cron from 'node-cron';

let tickBuffer = {
    USDT: [],
    FDUSD: []
};

// -----------------------------
// Prepare tick: store raw kline data
// -----------------------------
export const prepData = (coin, data) => {
    if (!data || !data.k) {
        console.log("Received a non-kline message, skipping...");
        return; 
    }
    const { t: opentime, o: open, h: high, l: low, c: close, v: volume, T: closetime,
            q: quoteVolume, n: trades, V: takerBase, Q: takerQuote } = data.k;

    const formattedData = {
        opentime,
        open,
        high,
        low,
        close,
        volume,
        closetime,
        quote_volume: quoteVolume,
        trades,
        taker_base: takerBase,
        taker_quote: takerQuote
    };

    tickBuffer[coin].push(formattedData);
    console.log("Tick added to buffer:", coin, tickBuffer[coin].length);
};

// -----------------------------
// Process buffer and aggregate
// -----------------------------
const processCoinData = async (coin) => {
    const buffer = tickBuffer[coin];
    if (buffer.length === 0) return;
    const currentBatch = [...buffer];
    tickBuffer[coin] = [];

    const open = parseFloat(currentBatch[0].open);
    const close = parseFloat(currentBatch[currentBatch.length - 1].close);
    const high = Math.max(...currentBatch.map(t => parseFloat(t.high)));
    const low = Math.min(...currentBatch.map(t => parseFloat(t.low)));
    const totalVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.volume || 0), 0);
    const totalQuoteVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.quote_volume || 0), 0);
    const totalTrades = currentBatch.reduce((sum, t) => sum + parseFloat(t.trades || 0), 0);
    const totalTakerBase = currentBatch.reduce((sum, t) => sum + parseFloat(t.taker_base || 0), 0);
    const totalTakerQuote = currentBatch.reduce((sum, t) => sum + parseFloat(t.taker_quote || 0), 0);

    const opentime = currentBatch[0].opentime;
    const closetime = currentBatch[currentBatch.length - 1].closetime;

    try {
        // Example SQL query (uncomment and adapt if using DB)
        // const query = `INSERT INTO "${table}" (opentime, open, high, low, close, volume, closetime, quote_volume, trades, taker_base, taker_quote)
        //                VALUES (${opentime}, ${open}, ${high}, ${low}, ${close}, ${totalVolume}, ${closetime}, ${totalQuoteVolume}, ${totalTrades}, ${totalTakerBase}, ${totalTakerQuote})`;
        // await pool.query(query);

        return {
            opentime,
            open,
            high,
            low,
            close,
            volume: totalVolume,
            closetime,
            quote_volume: totalQuoteVolume,
            trades: totalTrades,
            taker_base: totalTakerBase,
            taker_quote: totalTakerQuote
        };
    } catch (err) {
        console.error(`[${coin}] Error processing data:`, err);
    }
};

export { processCoinData };
