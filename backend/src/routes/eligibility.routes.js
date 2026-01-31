import express from 'express';
// Import the service logic using its new industry-standard name
import { checkEligibility } from '../services/eligibility.service.js';

const router = express.Router();

/**
 * @route   POST /api/check-eligibility
 * @desc    Analyze user details and return eligible government schemes
 * @access  Public
 */
router.post('/check-eligibility', checkEligibility);

export default router;
