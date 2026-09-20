import { Router } from "express";
import { getData } from "../controllers/data.controller";

const dataRouter = Router();

dataRouter.get("/data", getData);

export { dataRouter };
