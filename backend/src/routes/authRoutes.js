import espress from 'express';
import { signUp } from '../controllers/authController.js';
import { signIn } from '../controllers/authController.js';

const router = espress.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);

export default router;