// userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // ⬅️ Only required if not a Google user
    required: function () {
      return !this.googleAccount;
    },
  },
  role: {
    type: String,
    enum: ['Customer', 'Seller', 'Courier', 'Admin'], 
    default: 'Customer',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyToken: String,
  verifyTokenExpiry: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  // ✅ New fields for Google Auth support
  googleAccount: {
    type: Boolean,
    default: false,
  },
  picture: {
    type: String, 
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleAccount) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
