import express from "express";
const noticeRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import noticeController from "../controllers/noticeController.js";



export default noticeRoutes;
