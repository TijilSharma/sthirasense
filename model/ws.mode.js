import { io } from "socket.io-client";
import { pool } from "../server.js";

let socket = null;

export function connectWS() {
  if (socket) return socket;

  const ML_URL =
    process.env.NODE_ENV === "production"
      ? "https://sthirapython.onrender.com"
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
  try {
    // 1️⃣ Insert derived features if they exist
    if (data.features) {
      pool.query(
        "INSERT INTO derivedfeat (timestamp_ms, features) VALUES ($1, $2)",
        [data.features.timestamp, data.features.features]
      ).catch(err => console.error("Error inserting derivedfeat:", err));
    }

    // 2️⃣ Insert merged predictions
    const p1 = data.prediction_1.prediction;
    const p2 = data.prediction_2.prediction;

    if (p1 && p2) {
      const insertQuery = `
        INSERT INTO outputs (
          timestamp_1, max_peg_deviation, max_peg_deviation_pct, risk_level, risk_score, alert_required_1, inference_time_ms_1,
          timestamp_2, depeg_predicted, depeg_probability, confidence_level, threshold_used, risk_classification, alert_required_2, inference_time_ms_2
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13, $14, $15
        )
        RETURNING *;
      `;

      const values = [
        p1.timestamp,
        p1.max_peg_deviation,
        p1.max_peg_deviation_pct,
        p1.risk_level,
        p1.risk_score,
        p1.alert_required,
        p1.inference_time_ms,

        p2.timestamp,
        p2.depeg_predicted,
        p2.depeg_probability,
        p2.confidence_level,
        p2.threshold_used,
        p2.risk_classification,
        p2.alert_required,
        p2.inference_time_ms,
      ];

      pool.query(insertQuery, values)
        .then(res => console.log("Inserted outputs row ✅", res.rows[0]))
        .catch(err => console.error("Error inserting outputs:", err, data));
    } else {
      console.warn("Prediction data incomplete, skipping outputs insert", data);
    }
  } catch (err) {
    console.error("Error handling ml_response:", err);
  }
});


  return socket;
}
