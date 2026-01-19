import { Router } from "express";
import { 
    machingLogicController,
    endVideoCallController
} from "../controllers/logic.controller.js";

const router: Router = Router();

router.post("/match", machingLogicController);
router.post("/end-call", endVideoCallController);

export default router;