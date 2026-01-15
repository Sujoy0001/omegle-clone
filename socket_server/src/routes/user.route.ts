import { Router } from "express"
import { 
    setUserController, 
    updateUserController,
    findUserController
} from "../controllers/user.controller.js"

const router: Router = Router();

router.route('/set').post(setUserController);
router.route('/update').put(updateUserController);
router.route('/find/:id').get(findUserController);

export default router;