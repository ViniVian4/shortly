import express from 'express';

import { register } from '../controllers/authController.js';
import { verifyRegister } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', verifyRegister,  register);

export default router;