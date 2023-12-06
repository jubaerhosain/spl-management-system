import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import rootRoutes from "./src/routes/rootRoutes.js";
import { defaultErrorHandler } from "./src/middlewares/common/defaultErrorHandler.js";
import { notFoundHandler } from "./src/middlewares/common/notFoundHandler.js";
import fileUtils from "./src/utils/fileUtils.js";
import config from "./src/configs/config.js";

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

app.use("/api", rootRoutes);

app.use(notFoundHandler);

app.use(defaultErrorHandler);

export default app;