import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import mainRoutes from "./routes/mainRoutes.js";
import { defaultErrorHandler } from "./middlewares/common/defaultErrorHandler.js";
import { notFoundHandler } from "./middlewares/common/notFoundHandler.js";
import fileUtils from "./utils/fileUtils.js";
import config from "./config/config.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(fileUtils.getDirectoryName(import.meta.url), "public")));

app.use(cookieParser(config.cookie.secret));

app.use("/api", mainRoutes);

app.use(notFoundHandler);

app.use(defaultErrorHandler);

export default app;

/**
 * Common password
 * 1119@iit.DU
 */
