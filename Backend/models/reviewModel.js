// models/reviewModel.js
import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
