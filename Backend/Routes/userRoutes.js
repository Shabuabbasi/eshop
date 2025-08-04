import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleLogin,
  updateUserInfo
} from '../controllers/userController.js';
import {protect} from '../middlewares/authMiddleware.js'


const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.get('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/auth/google', googleLogin); 
router.put('/update-info', protect, updateUserInfo);

export default router;
