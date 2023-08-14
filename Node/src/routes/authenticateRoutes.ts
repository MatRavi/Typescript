import { Router } from "express"
import { authenticateController } from "../controllers/authenticateController";

const authenticateRoutes = Router();

const controller = new authenticateController();

authenticateRoutes.post('/create/', controller.create)

export { authenticateRoutes };