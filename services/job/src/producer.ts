import { Kafka, Producer, Admin } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();

let producer: Producer | null = null;
let admin: Admin | null = null;

const KAFKA_ENABLED =
  typeof process.env.KAFKA_BROKER === "string" &&
  process.env.KAFKA_BROKER.trim().length > 0;

export const connectKafka = async () => {
  if (!KAFKA_ENABLED) {
    console.log("⚠️ Kafka disabled - skipping connection");
    return;
  }

  try {
    const kafka = new Kafka({
      clientId: "job-service",
      brokers: [process.env.KAFKA_BROKER!],
    });

    admin = kafka.admin();
    await admin.connect();

    const topics = await admin.listTopics();

    if (!topics.includes("send-mail")) {
      await admin.createTopics({
        topics: [
          {
            topic: "send-mail",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });

      console.log("✅ Topic 'send-mail' created");
    }

    await admin.disconnect();

    producer = kafka.producer();
    await producer.connect();

    console.log("✅ Kafka producer connected");
  } catch (error) {
    console.log("Kafka connection failed:", error);
  }
};

export const publishToTopic = async (
  topic: string,
  message: any
) => {
  if (!KAFKA_ENABLED || !producer) {
    console.log("⚠️ Kafka disabled - skipping message publish");
    return;
  }

  try {
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  } catch (error) {
    console.log("Failed to publish message to kafka", error);
  }
};

export const disconnectKafka = async () => {
  if (!producer || !KAFKA_ENABLED) return;

  await producer.disconnect();
};