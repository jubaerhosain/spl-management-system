import express from "express";
const noticeRoutes = express.Router();

import { checkAuthentication } from "../middlewares/authMiddleware.js";
import noticeController from "../controllers/noticeController.js";

noticeRoutes.post("notice");
noticeRoutes.get("notice");
noticeRoutes.get("notice/:noticeId");
noticeRoutes.put("notice/:noticeId");


export default noticeRoutes;
