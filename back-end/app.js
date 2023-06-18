// external imports
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import mainRoutes from "./routes/mainRoutes.js";
import { defaultErrorHandler } from "./middlewares/common/defaultErrorHandler.js";
import { notFoundHandler } from "./middlewares/common/notFoundHandler.js";
import fileUtils from "./utils/fileUtils.js";

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

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api", mainRoutes);

app.use(notFoundHandler);

app.use(defaultErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}...`);
});
