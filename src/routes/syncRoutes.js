import express from 'express';
import { fetchAndSyncDataset } from '../services/syncService.js';
import { authMiddleware, roleBasedAccess } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, roleBasedAccess(['admin']), async (req, res) => {
  try {
    const result = await fetchAndSyncDataset();
    res.status(200).json({
      success: true,
      message: 'Dataset synchronized successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
