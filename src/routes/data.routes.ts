import { Router } from "express";
import { getData } from "../controllers/data.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const dataRouter = Router();

dataRouter.get("/data", authenticateToken, getData);

export { dataRouter };
