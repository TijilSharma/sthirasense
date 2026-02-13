import express from 'express';
import cron from 'node-cron';

let tickBuffer = {
    USDT: [],
    FDUSD: []
};

export const prepData = (coin, data) => {
    if (!data || !data.k) {
        console.log("Received a non-kline message, skipping...");
        return; 
    }
    const { t: opentime, o: open, h: high, l: low, c: close, v: volume, T: closetime } = data.k;
    const formattedData = { opentime, open, high, low, close, volume, closetime };
    tickBuffer[coin].push(formattedData);

    console.log("Tick added to buffer:",coin, tickBuffer[coin].length);
}
const processCoinData = async (coin, table, pool) => {
  const buffer = tickBuffer[coin];
  if (buffer.length === 0) return;
  const currentBatch = [...buffer];
  tickBuffer[coin] = [];

  const open = parseFloat(currentBatch[0].open);
  const close = parseFloat(currentBatch[currentBatch.length - 1].close);
  const high = Math.max(...currentBatch.map(t => parseFloat(t.high)));
  const low = Math.min(...currentBatch.map(t => parseFloat(t.low)));
  const totalVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.volume || 0), 0);
  const opentime = currentBatch[0].opentime;
  const closetime = currentBatch[currentBatch.length - 1].closetime;

  try {
    const query = `INSERT INTO "${table}" (opentime, open, high, close, low, volume, closetime) 
                   VALUES (${opentime}, ${open}, ${high}, ${close}, ${low}, ${totalVolume}, ${closetime})`;
    await pool.query(query);
    return { success: true, message: `Data for ${coin} inserted successfully.` };
  } catch (err) {
    console.error(`[${coin}] Error processing data:`, err);
  }
};

const processDataUSDT = async (pool) => {
    if (tickBuffer.length === 0) return;
    const currentBatch = [...tickBuffer];
    tickBuffer = [];
    const open = parseFloat(currentBatch[0].open); // First tick's open
    const close = parseFloat(currentBatch[currentBatch.length - 1].close); // Last tick's close
    const high = Math.max(...currentBatch.map(t => parseFloat(t.high)));
    const low = Math.min(...currentBatch.map(t => parseFloat(t.low)));
    const totalVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.volume || 0), 0);
    
    const opentime = currentBatch[0].opentime;
    const closetime = currentBatch[currentBatch.length - 1].closetime;
    try{
        
        const query = `INSERT INTO "OHCLVUSDT" (opentime, open, high, close, low, volume, closetime) VALUES (${opentime}, ${open}, ${high}, ${close}, ${low}, ${totalVolume}, ${closetime})`;
        const result = await pool.query(query);
    } catch (err) {
        console.error("Error processing data:", err);
    }
}
const processDataUSDC = async (pool) => {
    if (tickBuffer.length === 0) return;
    const currentBatch = [...tickBuffer];
    tickBuffer = [];
    const open = parseFloat(currentBatch[0].open); // First tick's open
    const close = parseFloat(currentBatch[currentBatch.length - 1].close); // Last tick's close
    const high = Math.max(...currentBatch.map(t => parseFloat(t.high)));
    const low = Math.min(...currentBatch.map(t => parseFloat(t.low)));
    const totalVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.volume || 0), 0);
    
    const opentime = currentBatch[0].opentime;
    const closetime = currentBatch[currentBatch.length - 1].closetime;
    try{
        
        const query = `INSERT INTO "OHCLVUSDC" (opentime, open, high, close, low, volume, closetime) VALUES (${opentime}, ${open}, ${high}, ${close}, ${low}, ${totalVolume}, ${closetime})`;
        const result = await pool.query(query);
    } catch (err) {
        console.error("Error processing data:", err);
    }
}
const processDataDAI = async (pool) => {
    if (tickBuffer.length === 0) return;
    const currentBatch = [...tickBuffer];
    tickBuffer = [];
    const open = parseFloat(currentBatch[0].open); // First tick's open
    const close = parseFloat(currentBatch[currentBatch.length - 1].close); // Last tick's close
    const high = Math.max(...currentBatch.map(t => parseFloat(t.high)));
    const low = Math.min(...currentBatch.map(t => parseFloat(t.low)));
    const totalVolume = currentBatch.reduce((sum, t) => sum + parseFloat(t.volume || 0), 0);
    
    const opentime = currentBatch[0].opentime;
    const closetime = currentBatch[currentBatch.length - 1].closetime;
    try{
        
        const query = `INSERT INTO "OHCLVDAI" (opentime, open, high, close, low, volume, closetime) VALUES (${opentime}, ${open}, ${high}, ${close}, ${low}, ${totalVolume}, ${closetime})`;
        const result = await pool.query(query);
    } catch (err) {
        console.error("Error processing data:", err);
    }
}



export { processDataDAI, processDataUSDC, processDataUSDT, processCoinData };

