import redis from "redis";

// Create a Redis client instance
const client = redis.createClient();

client.set("name", "JubaerHosain");

setTimeout(() => {
    console.log(client.get("name"));
}, 2000);
