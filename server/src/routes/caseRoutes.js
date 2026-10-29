import express from 'express';
import {
  createCase,
  getCaseById,
  discoverClue,
  requestHint,
  submitAccusation,
  getCaseResult,
  getAllCases,
} from '../controllers/caseController.js';

const router = express.Router();

router.get('/', getAllCases);
router.post('/', createCase);
router.get('/:id', getCaseById);
router.post('/:id/clues/:clueId/discover', discoverClue);
router.post('/:id/hints', requestHint);
router.post('/:id/accuse', submitAccusation);
router.get('/:id/result', getCaseResult);

export default router;
