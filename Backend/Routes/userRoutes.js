import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
