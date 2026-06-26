import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const KAFKA_ENABLED =
  typeof process.env.KAFKA_BROKER === "string" &&
  process.env.KAFKA_BROKER.trim().length > 0;

console.log("🔥 Starting Kafka consumer...");

export const startSendMailConsumer = async () => {
  if (!KAFKA_ENABLED) {
    console.log("⚠️ Kafka disabled - skipping consumer");
    return;
  }

  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.KAFKA_BROKER!],
    });

    const consumer = kafka.consumer({
      groupId: "mail-service-group",
    });

    await consumer.connect();

    const topicName = "send-mail";

    await consumer.subscribe({
      topic: topicName,
      fromBeginning: false,
    });

    console.log("✅ Mail service consumer started");

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const { to, subject, html } = JSON.parse(
            message.value?.toString() || "{}"
          );

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });

          await transporter.sendMail({
            from: "HireHeaven <no-reply@hireheaven.com>",
            to,
            subject,
            html,
          });

          console.log(`✅ Mail sent to ${to}`);
        } catch (error) {
          console.log("Failed to send mail:", error);
        }
      },
    });
  } catch (error) {
    console.log("Kafka consumer failed:", error);
  }
};