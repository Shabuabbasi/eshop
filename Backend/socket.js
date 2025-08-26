import Chat from "./models/chatModel.js";
import Message from "./models/messageModel.js";


export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New client connected:", socket.id);

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat room: ${chatId}`);
    });

   socket.on("send_message", async (data) => {
  const { chatId, message } = data;

  try {
    // Save to DB
    const savedMsg = await new Message({
      chat: chatId,
      sender: message.senderId,
      text: message.text,
    }).save();

    const populated = await savedMsg.populate("sender").execPopulate();

    // Emit to all users in the room with sender info
    io.to(chatId).emit("receive_message", populated);


  // Also send notification to the receiver (not sender)
   const chatDoc = await Chat.findById(chatId);

        if (chatDoc) {
          chatDoc.participants.forEach((userId) => {
            if (userId.toString() !== message.senderId) {
              io.to(userId.toString()).emit("message_notification", populated);
            }
          });
        }

  } catch (error) {
    console.error("Socket message error:", error);
  }
});

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};
