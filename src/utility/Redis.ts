import * as redis from "redis";
import logger from "./logger.ts";

const client = redis.createClient({
  url: `${process.env.REDIS_CLIENT_URL}:${process.env.REDIS_CLIENT_PORT}`!,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 5) {
        logger.error("Redis backoff after retrying");
        return new Error("Stop reconnecting");
      }
      return Math.min(retries * 200, 3000);
    },
  },
});

client.on("connect", () => console.log("Redis Client is connecting"));
client.on("ready", () => console.log("Redis Client is ready"));
client.on("error", (err) => console.log("Redis Client Error", err));

try {
  await client.connect();
} catch (error) {
  logger.error(error, "Redis connection failed");
}

export default client;

// await client.set("foo", "bar");
// const result = await client.get("foo");
// console.log(result); // >>> bar
