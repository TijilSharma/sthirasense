import express from 'express';
import cron from 'node-cron';

let tickBuffer = [];

export const prepData = (data) => {
    const { t: opentime, o: open, h: high, l: low, c: close, v: volume, T: closetime } = data.k;
    const formattedData = { opentime, open, high, low, close, volume, closetime };
    tickBuffer.push(formattedData);
    // console.log("Tick added to buffer:", tickBuffer);
}

const processData = async (pool) => {
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
export default processData;