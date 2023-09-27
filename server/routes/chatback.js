import express from "express";
import { sendOTP } from "../controllers/emailsen.js";

const router = express.Router()

router.post('/api/otp/sendotp', sendOTP);

export default router