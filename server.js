import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import { processCoinData } from './data/routes/data.controller.js';
import cron from 'node-cron';
import createWS from './data/binancews.controller.js';
import { fetchUSDTSupplyData } from './data/routes/coingekko.controller.js';
import authRouter from './client/routes/auth.routes.js';
import apiRouter from './api/api.routes.js';
import apiGenRouter from './api/apiGen.js';
import { connectWS } from './model/ws.mode.js';
import { sendCoinData } from './model/sendCoinData.js';


const app = express();
const PORT = process.env.PORT || 3000;
export const pool = new Pool({
  connectionString: process.env.DB_URI,
});


const usdtWS = createWS('USDT', 'usdcusdt@kline_1m');
const fdusdWS = createWS('FDUSD', 'fdusdusdt@kline_1m');
// const socket = connectWS();

cron.schedule('* * * * *', async () => {
    let data = await processCoinData('USDT');
    fetchUSDTSupplyData('USDT','tether', data, pool);
    const payload = await sendCoinData('USDT', 'USDT', pool);
    // if (payload) {
    //     socket.emit('ml_data', payload);
    // }
    
});


app.use(express.json());
app.use('/v1/auth/', authRouter);
app.use('/v1/market/', apiRouter);
app.use('/v1/api/', apiGenRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${PORT}`);
});