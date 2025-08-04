// userModel.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  dob: {
    type: Date,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },

  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },

  contactNumber: {
    type: String,
  },

  nationalID: {
    type: String,
    minlength: 13,
    maxlength: 13,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
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

  googleAccount: {
    type: Boolean,
    default: false,
  },

  picture: {
    type: String,
  },

  createdAt: {
    type: Date,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.googleAccount) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
