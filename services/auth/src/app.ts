import express from "express";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.KAFKA_BROKER?.trim()) {
  connectKafka();
} else {
  console.log("⚠️ Kafka disabled - skipping connection");
}

app.use("/api/auth", authRoutes);

export default app;
