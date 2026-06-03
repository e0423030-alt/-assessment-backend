import express from 'express';
import {
  createComment,
  getAllComments,
  getCommentById,
  deleteComment
} from '../controllers/commentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/', authMiddleware, getAllComments);
router.get('/:commentId', authMiddleware, getCommentById);
router.delete('/:commentId', authMiddleware, deleteComment);

export default router;
