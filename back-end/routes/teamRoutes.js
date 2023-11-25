import { Router } from "express";
const teamRoutes = Router();

import teamController from "../controllers/teamController.js" 
import { checkAuthentication, isAdmin } from "../middlewares/authMiddleware.js";


// routes related to team 
teamRoutes.post("/", teamController.createTeam);
teamRoutes.get("/", teamController.getAllTeam);
teamRoutes.get("/:teamId", teamController.getTeam);
teamRoutes.put("/", teamController.updateTeam);
teamRoutes.delete("/:teamId", teamController.deleteTeam);

// routes related to team member
teamRoutes.get("/:teamId/member", teamController.getAllTeamMember);
teamRoutes.put("/:teamId/member", teamController.addTeamMember);
teamRoutes.delete("/:teamId/member/:memberId", teamController.removeTeamMember);

// routes related to request
teamRoutes.post('/team/:teamId/request', teamController.requestTeacher);
teamRoutes.get('/team/:teamId/request', teamController.getAllRequest);
teamRoutes.delete('/team/:teamId/request', teamController.deleteRequest);


export default teamRoutes;
