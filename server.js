import express from 'express';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { processCoinData } from './data/routes/data.controller.js';
import cron from 'node-cron';
import createWS from './data/binancews.controller.js';
import { fetchCoinData } from './data/routes/coingekko.controller.js';
import authRouter from './client/routes/auth.routes.js';

dotenv.config();
console.log("Redirect URI:", process.env.GOOGLE_REDIRECT_URI);

const app = express();
const port = process.env.PORT || 3000;
const pool = new Pool({
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

app.listen(port, ()=>{
    console.log(`Listening on Port: ${port}`)
});