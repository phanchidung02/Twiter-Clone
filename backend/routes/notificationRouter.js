import express from 'express';
import { protectRouter } from '../middleware/protectRouter.js';
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protectRouter, getNotifications);
router.delete('/deleteAll', protectRouter, deleteAllNotifications);
router.delete('/delete', protectRouter, deleteNotification);

export default router;
