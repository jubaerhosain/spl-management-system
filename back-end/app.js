// external imports
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

// internal imports
import mainRouter from "./routers/mainRouter.js";
import { defaultErrorHandler } from "./middlewares/common/defaultErrorHandler.js";
import { notFoundHandler } from "./middlewares/common/notFoundHandler.js";
import fileUtils from "./utils/fileUtils.js";

// create express app
const app = express();

// CORS configuration
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// request parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set static folder
app.use(express.static(path.join(fileUtils.getDirectoryName(import.meta.url), "public")));

// set cookie parser middleware [set cookie secret to automatically signs with it]
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/api", mainRouter);

// 404 not found middleware
app.use(notFoundHandler);

// default error handling middleware
app.use(defaultErrorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}...`);
});
