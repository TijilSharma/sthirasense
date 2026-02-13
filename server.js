import express from 'express';
import 'dotenv/config';
import http from 'http';
import WebSocket from 'ws';
import { Pool } from 'pg';
import processData from './data/routes/data.controller.js';
import { prepData } from './data/routes/data.controller.js';
import cron from 'node-cron';


const app = express();
const port = process.env.PORT || 3000;
const ws = new WebSocket(process.env.BINANCE_URI)
const pool = new Pool({
  connectionString: process.env.DB_URI,
});

ws.on('open',()=>{
    console.log("Connected to Binance Websocket")
})

ws.on('message',(msg)=>{
    const data = JSON.parse(msg)
    console.log(data);
    prepData(data);
})

ws.on('close', ()=>{
    console.log("Websocket closing")
})

cron.schedule('* * * * *', () => {
    processData(pool);
});

app.use(express.json());
app.listen(port, ()=>{
    console.log(`Listening on Port: ${port}`)
});