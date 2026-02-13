import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { Pool } from 'pg';
import { processCoinData } from './data/routes/data.controller.js';
import cron from 'node-cron';
import createWS from './data/binancews.controller.js';
import { fetchCoinData } from './data/routes/coingekko.controller.js';
import authRouter from './client/routes/auth.routes.js';
import apiRouter from './api/api.routes.js';
import apiGenRouter from './api/apiGen.js';


console.log("JWT Secret:", process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT || 3000;
export const pool = new Pool({
  connectionString: process.env.DB_URI,
});

const usdtWS = createWS('USDT', 'usdcusdt@kline_1m');
const fdusdWS = createWS('FDUSD', 'fdusdusdt@kline_1m');

cron.schedule('* * * * *', () => {
    processCoinData('USDT', 'OHCLVUSDT', pool);
    processCoinData('FDUSD', 'OHCLVFDUSDT', pool);
    fetchCoinData(pool);
});


app.use(express.json());
app.use('/v1/auth/', authRouter);
app.use('/v1/market/', apiRouter);
app.use('/v1/api/', apiGenRouter);

app.listen(port, ()=>{
    console.log(`Listening on Port: ${port}`)
});