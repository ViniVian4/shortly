import express from 'express';

import { register, login } from '../controllers/authController.js';
import { verifyRegister, verifyLogin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', verifyRegister, register);
router.post('/signin', verifyLogin, login);

export default router;