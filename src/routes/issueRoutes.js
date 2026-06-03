import express from 'express';
import {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
  updateIssueStatus
} from '../controllers/issueController.js';
import { authMiddleware, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createIssue);
router.get('/', authMiddleware, getAllIssues);
router.get('/:issueId', authMiddleware, getIssueById);
router.patch('/:issueId', authMiddleware, updateIssue);
router.delete('/:issueId', authMiddleware, roleBasedAccess(['admin', 'manager']), deleteIssue);
router.patch('/:issueId/assign', authMiddleware, roleBasedAccess(['admin', 'manager']), assignIssue);
router.patch('/:issueId/status', authMiddleware, updateIssueStatus);

export default router;
