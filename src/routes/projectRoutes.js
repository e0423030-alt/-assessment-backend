import express from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { authMiddleware, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleBasedAccess(['admin', 'manager']), createProject);
router.get('/', authMiddleware, getAllProjects);
router.get('/:projectId', authMiddleware, getProjectById);
router.patch('/:projectId', authMiddleware, roleBasedAccess(['admin', 'manager']), updateProject);
router.delete('/:projectId', authMiddleware, roleBasedAccess(['admin', 'manager']), deleteProject);

export default router;
