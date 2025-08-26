import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    }
  ],
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  estimatedDelivery: Date,
  createdAt: { type: Date, default: Date.now },
});


const Order = mongoose.model('Order', orderSchema);
export default Order;
