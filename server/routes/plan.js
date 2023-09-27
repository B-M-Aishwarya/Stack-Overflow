import express from 'express';
import { optplan } from '../controllers/users.js'
import { payoption } from '../controllers/razorpay.js'

const router = express.Router();

router.patch('/api/plan/:userId', optplan )
router.get('/api/razorpay-options/silver', payoption)

export default router