import express from 'express';
import { protectRouter } from '../middleware/protectRouter.js';
import {
  commentOnPost,
  createPost,
  deleteComment,
  deletePost,
  editComment,
  editPost,
  getAllPost,
  getFollowingPost,
  getLikedPost,
  getUserPost,
  likeAndUnlikePost,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create', protectRouter, createPost);
router.patch('/edit/:id', protectRouter, editPost);
router.delete('/delete/:id', protectRouter, deletePost);
router.post('/like/:id', protectRouter, likeAndUnlikePost);
router.post('/comment/:postId', protectRouter, commentOnPost);
router.patch('/:postId/comment/:commentId', protectRouter, editComment);
router.delete('/:postId/comment/:commentId', protectRouter, deleteComment);
router.get('/all', protectRouter, getAllPost);
router.get('/liked/:id', protectRouter, getLikedPost);
router.get('/following', protectRouter, getFollowingPost);
router.get('/user/:username', protectRouter, getUserPost);

export default router;
