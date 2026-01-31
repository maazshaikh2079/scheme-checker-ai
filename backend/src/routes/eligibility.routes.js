import express from 'express';
import { checkEligibility } from '../services/eligibility.service.js';

const router = express.Router();

router.post('/check-eligibility', checkEligibility);

export default router;
