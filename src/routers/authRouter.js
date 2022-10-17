import express from 'express';

import { register, login, logout } from '../controllers/authController.js';
import { verifyRegister, verifyLogin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', verifyRegister, register);
router.post('/signin', verifyLogin, login);
router.post('/logout', logout);

export default router;