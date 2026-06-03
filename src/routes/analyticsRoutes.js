import express from 'express';
import {
  getIssueAnalytics,
  getProjectAnalytics,
  getDeveloperAnalytics
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/issues', authMiddleware, getIssueAnalytics);
router.get('/projects', authMiddleware, getProjectAnalytics);
router.get('/developers', authMiddleware, getDeveloperAnalytics);

export default router;
