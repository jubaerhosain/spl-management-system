import http from "http";
import app from "./app.js";
import config from "./config/config.js";

import { initializeSocket } from "./sockets/socket.js";
import { initializeMySqlConnection } from "./config/mysql.js";
import { initializeRedisConnection } from "./config/redis.js";

initializeMySqlConnection();
initializeRedisConnection();

const server = http.createServer(app);
initializeSocket(server, { cors: { origin: "*" } });

server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}...`);
});
