import { Router } from "express";
import {
    sendMessageController
} from "../controllers/message.controller.js";

const router: Router = Router();

router.route("/send").post(sendMessageController);

export default router;