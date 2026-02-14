import { prepData } from "./routes/data.controller.js";
import WebSocket from 'ws';

function createWS(coin, stream) {
  const url = `wss://stream.binance.us:9443/ws/${stream}`;
  const ws = new WebSocket(url);

  ws.on('open', () => console.log(`[${coin}] Connected to Binance WS`));
  ws.on('close', () => console.log(`[${coin}] Connection closed`));

  ws.on('message', async (msg) => {
    console.log(`[Raw Stream] Received data for: ${coin}`);
    const data = JSON.parse(msg);
    // handle single/combined stream
    prepData(coin, data);
});

  return ws;
}

export default createWS;