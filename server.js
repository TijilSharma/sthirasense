import express from 'express';
import 'dotenv/config';
import http from 'http';
import WebSocket from 'ws';


const app = express();
const port = process.env.PORT || 3000;
const ws = new WebSocket(process.env.BINANCE_URI)

ws.on('open',()=>{
    console.log("Connected to Binance Websocket")
})

ws.on('message',(msg)=>{
    const data = JSON.parse(msg)
    console.log(data);
})

ws.on('close', ()=>{
    console.log("Websocket closing")
})

app.use(express.json());
app.listen(port, ()=>{
    console.log(`Listening on Port: ${port}`)
});