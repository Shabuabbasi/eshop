import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    unreadCount: { type: Number, default: 0 },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: false },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: false },
    
  },



  { timestamps: true }
);
export default mongoose.model("Chat", chatSchema);
