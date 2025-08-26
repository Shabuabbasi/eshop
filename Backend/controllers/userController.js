import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET;

const allowedAdminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
const allowedRoles = ['Customer', 'Seller', 'Courier'];

// REGISTER USER — updated
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role)
      return res.status(400).json({ success: false, message: 'All fields required' });

    // ❌ Block any Admin registration attempt
    if (role === 'Admin' || allowedAdminEmails.includes(email)) {
      return res.status(403).json({ success: false, message: 'Admin registration is not allowed.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const verifyToken = crypto.randomBytes(32).toString('hex');
    const verifyTokenExpiry = Date.now() + 30 * 60 * 1000;

    // ✅ Safe role assignment
    const finalRole = allowedRoles.includes(role) ? role : 'Customer';

    const newUser = await User.create({
      name,
      email,
      password,
      role: finalRole,
      verifyToken,
      verifyTokenExpiry,
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;
    await sendEmail(email, "Verify your email", `
      <h2>Hello ${name},</h2>
      <p>Please verify your email by clicking below:</p>
      <a href="${verifyUrl}">Verify Email</a>
    `);

    res.status(201).json({ success: true, message: 'Check your email to verify.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GOOGLE LOGIN — updated
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    const allowedAdminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

    let user = await User.findOne({ email });

    // 🚫 If admin email, block auto-creation
    if (!user && allowedAdminEmails.includes(email)) {
      return res.status(403).json({
        success: false,
        message: 'Admin login only allowed for existing users',
      });
    }

    // Auto-create only Customer role
    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        role: 'Customer',
        isVerified: true,
        googleAccount: true,
        picture,
      });
    }

    // ✅ Extra check for admin login — must be whitelisted
    if (user.role === 'Admin' && !allowedAdminEmails.includes(email)) {
      return res.status(403).json({ success: false, message: 'Unauthorized admin login' });
    }

    const authToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(401).json({ success: false, message: 'Invalid Google Token' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    if (!token) return res.status(400).json({ success: false, message: 'Missing token' });

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, message: 'Token expired or invalid' });

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isVerified)
      return res.status(403).json({ success: false, message: 'Email not verified' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: 'Not logged in' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ success: true, message: 'Logged out' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = `Click to reset password: ${resetURL}`;
    await sendEmail(email, 'Reset Password', message);

    res.json({ success: true, message: 'Reset link sent to email' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Token is invalid or expired' });

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.user._id; 

    const {
      name,
      dob,
      gender,
      address,
      contactNumber,
      nationalID,
    } = req.body;

    if (nationalID && nationalID.length !== 13) {
      return res.status(400).json({ success: false, message: 'National ID must be 13 characters long.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        dob,
        gender,
        address,
        contactNumber,
        nationalID,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating user info:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
