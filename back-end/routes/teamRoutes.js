import { Router } from "express";
const teamRouter = Router();

import teamController from "../controllers/teamController.js" 

teamRouter.post("/", teamController.createTeam);
teamRouter.get("/", teamController.getAllTeam);
teamRouter.get("/:teamId", teamController.getTeam);
teamRouter.get("/:teamId/member", teamController.getAllTeamMember);
teamRouter.put("/", teamController.updateTeam);
teamRouter.put("/:teamId/member", teamController.addTeamMember);
teamRouter.delete("/:teamId", teamController.deleteTeam);
teamRouter.delete("/:teamId/member/:memberId", teamController.deleteTeamMember);

export default teamRouter;
