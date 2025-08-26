import express from 'express';
import Chat from '../models/chatModel.js';
import Message from '../models/messageModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

// ✅ 1. Get all messages for a chat
router.get('/messages/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }).populate('sender');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// ✅ 2. Get all chats for a user
router.get('/:userId', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId }).populate('participants') .populate('productId', 'name price image');
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get chats' });
  }
});






router.post('/', async (req, res) => {
  try {
    const { senderId, receiverId, productId, orderId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ error: 'Sender and receiver are required' });
    }

    // Build query dynamically
    const query = {
      participants: { $all: [senderId, receiverId] }
    };
    if (productId) query.productId = productId;
    if (orderId) query.orderId = orderId;

    let chat = await Chat.findOne(query)
      .populate('participants', 'name email')
      .populate('productId', 'name price image');

    // If no chat exists, create one
    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        productId: productId || undefined,
        orderId: orderId || undefined
      });
      await chat.save();

      // Repopulate after saving
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email')
        .populate('productId', 'name price image');
    }

    res.json(chat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

















// // POST /api/chat ori
// router.post("/", async (req, res) => {
//   const { senderId, receiverId, productId } = req.body;

//   if (!senderId || !receiverId || !productId) {
//     return res.status(400).send("Missing data");
//   }

//   try {
//     // 🔍 Check if chat already exists between these users for the same product
//     let existingChat = await Chat.findOne({
//       participants: { $all: [senderId, receiverId], $size: 2 },
//       product: productId,
//     });

//     if (existingChat) {
//       return res.status(200).json(existingChat); // ✅ Reuse existing chat
//     }

//     // ❌ If not found, create new
//     const newChat = new Chat({
//       participants: [senderId, receiverId],
//       product: productId,
//     });

//     await newChat.save();
//       const introMessage = new Message({
//       chat: newChat._id,
//       sender: senderId, // You can also make this from system/admin
//       text: `🛒 Chat started for Product ID: ${productId}`,
//     });

//     await introMessage.save();

//     res.status(201).json(newChat);
//   } catch (err) {
//     console.error("Chat creation error:", err);
//     res.status(500).send("Server error");
//   }
// });















router.post('/message', async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    // Save message
    const message = new Message({
      chat: chatId,
      sender: senderId,
      text,
    });
    await message.save();

    // If sender is NOT the seller, increment unread count
    // (Assumes first participant is seller — adjust if needed)
    const sellerId = chat.participants[0].toString();
    if (senderId.toString() !== sellerId) {
      chat.unreadCount += 1;
      await chat.save();
    }

    res.status(201).json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});




// GET /api/chat/product/:id
router.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

//unread count
router.post('/:chatId/mark-read', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    chat.unreadCount = 0;
    await chat.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Error marking chat as read:", err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});



export default router;
