import React, { useEffect, useState } from "react";
import socket from "../Components/socket";
import axios from "axios";
import { MessageCircle, Send, User } from "lucide-react";

const ChatPage = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const searchParams = new URLSearchParams(window.location.search);
  const productId = searchParams.get("productId");
  const orderId = searchParams.get("orderId");
  const sellerId = searchParams.get("sellerId");

  // Socket setup
  useEffect(() => {
    if (user?._id) {
      socket.emit("setup", user._id);
    }
  }, [user]);

  // Join selected chat room
  useEffect(() => {
    if (selectedChat) {
      socket.emit("join_chat", selectedChat._id);
    }
  }, [selectedChat]);

  // Handle incoming messages
  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.chat === selectedChat?._id || msg.chatId === selectedChat?._id) {
        // Message for currently open chat
        setMessages((prev) => [...prev, msg]);
      } else {
        // Increment unread count for the relevant chat
        setChats((prev) =>
          prev.map((c) =>
            c._id === msg.chat || c._id === msg.chatId
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
              : c
          )
        );
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_notification", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_notification", handleReceive);
    };
  }, [selectedChat]);

  // Create or get chat if sellerId present
  useEffect(() => {
    if (sellerId && user?._id) {
      axios
        .post("/api/chat", {
          senderId: user._id,
          receiverId: sellerId,
          productId,
          orderId,
        })
        .then((res) => {
          setSelectedChat(res.data);
          setChats((prev) => {
            const exists = prev.find((c) => c._id === res.data._id);
            return exists ? prev : [...prev, res.data];
          });
        })
        .catch((err) => console.error("Failed to create chat", err));
    }
  }, [sellerId, user?._id, productId, orderId]);

  // Load all user chats
  useEffect(() => {
    if (!user?._id) return;
    axios
      .get(`/api/chat/${user._id}`)
      .then((res) => setChats(Array.isArray(res.data) ? res.data : []))
      .catch(() => setChats([]));
  }, [user]);

  // Load messages when selected chat changes
  useEffect(() => {
    if (!selectedChat?._id) return;

    socket.emit("join_chat", selectedChat._id);

    axios
      .get(`/api/chat/messages/${selectedChat._id}`)
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]));
  }, [selectedChat]);

  // Send message
  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedChat || !user?._id) return;

    const msgData = {
      chatId: selectedChat._id,
      senderId: user._id,
      text: newMsg,
    };

    const localMsg = {
      ...msgData,
      sender: { _id: user._id },
    };

    setMessages((prev) => [...prev, localMsg]);
    setNewMsg("");

    socket.emit("send_message", { chatId: selectedChat._id, message: msgData });

    try {
      await axios.post("/api/chat/message", msgData);
    } catch (err) {
      console.error("Failed to store message:", err);
    }
  };

  const markChatAsRead = async (chatId) => {
    try {
      await axios.post(`/api/chat/${chatId}/mark-read`, { userId: user._id });
      setChats((prev) =>
        prev.map((c) => (c._id === chatId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err) {
      console.error("Failed to mark chat as read", err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 p-4 overflow-y-auto bg-white shadow-md">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-700">
          <MessageCircle className="text-blue-500" /> Messages
        </h2>

        {chats.map((chat) => {
          const otherUser =
            chat.participants?.find((p) => p._id !== user._id) || {};
          return (
            <div
              key={chat._id}
              onClick={() => {
                setSelectedChat(chat);
                markChatAsRead(chat._id);
              }}
              className={`p-3 rounded-xl mb-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
                selectedChat?._id === chat._id ? "bg-gray-100" : ""
              }`}
            >
              <User className="text-gray-500" />
              <span className="text-gray-800 font-medium flex-1">
                {otherUser?.name || "Unknown User"}
              </span>
              {chat.unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Chat Window */}
      <div className="flex flex-col flex-1 p-20 relative">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {/* Product Info */}
          {selectedChat?.productId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-md flex items-center gap-4 p-4 mb-4">
              <img
                src={
                  typeof selectedChat.productId === "object" &&
                  selectedChat.productId.image
                    ? selectedChat.productId.image
                    : "/placeholder.png"
                }
                alt={
                  typeof selectedChat.productId === "object"
                    ? selectedChat.productId.name
                    : "Product"
                }
                className="w-20 h-20 object-cover rounded-md border border-blue-100"
              />
              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  {typeof selectedChat.productId === "object"
                    ? selectedChat.productId.name
                    : "Loading..."}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>ID:</strong>{" "}
                  {typeof selectedChat.productId === "object"
                    ? selectedChat.productId._id
                    : selectedChat.productId}
                </p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm text-sm ${
                msg.sender?._id === user._id || msg.senderId === user._id
                  ? "ml-auto bg-blue-100 text-right"
                  : "bg-gray-100"
              }`}
            >
              <div>{msg.text}</div>
              {msg.createdAt && (
                <div className="text-gray-500 text-xs mt-1">
                  {formatTime(msg.createdAt)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center border-t pt-4">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="ml-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-1"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
