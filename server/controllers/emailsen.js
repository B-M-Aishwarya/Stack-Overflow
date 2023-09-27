import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER,
    pass: process.env.USER_PASS
  },
});

let isSent = false;

export const sendOTP = async (req, res) => {
  const { email, generatedOtp } = req.body;

  console.log('Received request to send OTP. Email:', email, 'Generated OTP:', generatedOtp);

  try {
    const mailOptions = {
      from: 'Verification <process.env.USER>',
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP code is: ${generatedOtp}`,
    };

    await transporter.sendMail(mailOptions);
    // Update true if sent successfully
    isSent = true;

    console.log('OTP sent successfully');
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    // Update false if error occured 
    isSent = false;

    console.error('Failed to send OTP');
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
};
