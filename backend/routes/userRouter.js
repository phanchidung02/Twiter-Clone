import express from 'express';
import { protectRouter } from '../middleware/protectRouter.js';
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from '../controllers/userController.js';
const router = express.Router();

router.get('/profile/:username', protectRouter, getUserProfile);
router.post('/follow/:id', protectRouter, followUnfollowUser);
router.get('/suggested', protectRouter, getSuggestedUsers);
router.post('/updated', protectRouter, updateUser);

export default router;
