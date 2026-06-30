import express from "express";
import dotenv from "dotenv";
import routes from "./routes.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { startSendMailConsumer } from "./consumer.js";

dotenv.config();

if (process.env.KAFKA_BROKER) {
  startSendMailConsumer();
} else {
  console.log("Kafka not configured");
}

if (
  process.env.CLOUD_NAME &&
  process.env.API_KEY &&
  process.env.API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });
} else {
  console.log("Cloudinary env missing");
}

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/utils", routes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Utils Service running on PORT: ${PORT}`);
});
