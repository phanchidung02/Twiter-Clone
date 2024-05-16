import express from 'express';
import { signUp, login, logout, getMe } from '../controllers/authController.js';
import { protectRouter } from '../middleware/protectRouter.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', protectRouter, getMe);

export default router;
