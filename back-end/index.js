import http from "http";
import app from "./app.js";
import config from "./src/configs/config.js";

import { initializeMySqlConnection } from "./src/configs/mysql.js";
// import { initializeRedisConnection } from "./config/redis.js";

initializeMySqlConnection();
// initializeRedisConnection(); 

const server = http.createServer(app);

server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
});
