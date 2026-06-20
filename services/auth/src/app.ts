import express from "express";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes FIRST
app.use("/api/auth", authRoutes);

const start = async () => {
  try {
    await connectKafka();

    app.listen(PORT, () => {
      console.log(`Auth service running on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start service:", err);
    process.exit(1);
  }
};

start();

export default app;