import redis from "redis";

const redisClient = redis.createClient();

redisClient.on("end", () => {
    console.log("Redis connection closed");
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export function initializeRedisConnection() {
    redisClient
        .connect()
        .then(() => {
            console.log("Redis connection has been established successfully.");
        })
        .catch((err) => {
            console.error("Error:", err);
        });
}

export default redisClient;
