import { io } from "socket.io-client";

let socket = null;

export function connectWS() {
  if (socket) return socket;

  const ML_URL =
    process.env.NODE_ENV === "production"
      ? "https://your-ml-service.com"
      : "http://localhost:3001";
  socket = io(ML_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });
  socket.on("connect", () => {
    console.log("Connected to ML server ✅");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from ML server ❌");
  });

  socket.on("ml_response", (data) => {
    console.log("Prediction received:", data);

    // Optional: store in DB here
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  return socket;
}
