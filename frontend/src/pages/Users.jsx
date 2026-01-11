import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Users = () => {
  const { user, logout } = useContext(AuthContext); 
  const { socket, onlineUsers } = useContext(SocketContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [showUsersMobile, setShowUsersMobile] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeout = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  /* USERS */
  useEffect(() => {
    api.get("/users").then((res) => {
      setUsers(res.data.filter((u) => u._id !== user._id));
    });
  }, [user]);

  /* MESSAGES */
  useEffect(() => {
    if (!selectedUser || !socket) return;

    api.get(`/messages/${user._id}/${selectedUser._id}`).then((res) => {
      setMessages(
        res.data.map((m) => ({ ...m, fromSelf: m.sender === user._id }))
      );
      scrollToBottom();

      socket.emit("mark-seen", {
        sender: selectedUser._id,
        receiver: user._id,
      });
    });
  }, [selectedUser, socket, user]);

  /* SOCKET */
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (message) => {
      if (
        selectedUser &&
        (message.sender === selectedUser._id ||
          message.receiver === selectedUser._id)
      ) {
        setMessages((prev) => [
          ...prev,
          { ...message, fromSelf: message.sender === user._id },
        ]);
        socket.emit("mark-seen", {
          sender: message.sender,
          receiver: user._id,
        });
        scrollToBottom();
      }
    });

    socket.on("message-seen", () => {
      setMessages((prev) =>
        prev.map((m) => (m.fromSelf ? { ...m, seen: true } : m))
      );
    });

    socket.on("user-typing", () => setTyping(true));
    socket.on("user-stop-typing", () => setTyping(false));

    return () => socket.off();
  }, [socket, selectedUser, user]);

  /* SEND */
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender: user._id,
      receiver: selectedUser._id,
      text: newMessage.trim(),
    };

    socket.emit("send-message", msg);
    setMessages((prev) => [...prev, { ...msg, fromSelf: true, seen: false }]);
    setNewMessage("");
    scrollToBottom();
    socket.emit("stop-typing", msg);
  };

  /* TYPING */
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    socket.emit("typing", {
      sender: user._id,
      receiver: selectedUser._id,
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", {
        sender: user._id,
        receiver: selectedUser._id,
      });
    }, 800);
  };

  /* FILE */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", user._id);
    formData.append("receiver", selectedUser._id);

    const res = await api.post("/messages/upload", formData);

    socket.emit("send-file", res.data);
    setMessages((prev) => [
      ...prev,
      { ...res.data, fromSelf: true, seen: false },
    ]);
    scrollToBottom();
  };

  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#EFF5D2] via-[#C6D870] to-[#EFF5D2]">
      
      {/* USERS LIST */}
      <div
        className={`w-80 border-r bg-gradient-to-b from-white to-[#EFF5D2]
        ${selectedUser && !showUsersMobile ? "hidden" : "block"} md:block`}
      >
        <h2 className="text-xl font-bold p-4 text-[#556B2F]">
          💬 ChitChat
        </h2>

        <div className="space-y-2 p-2">
          {users.map((u) => {
            const online = onlineUsers.includes(u._id);

            return (
              <Card
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  setShowUsersMobile(false);
                }}
                className="cursor-pointer border-none bg-white/80 hover:bg-[#C6D870] shadow-sm hover:shadow-md transition"
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FA31E] to-[#556B2F] text-white flex items-center justify-center font-bold">
                      {u.name[0]}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        online ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{u.name}</h3>
                    <p className="text-xs text-gray-600">{u.email}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="p-4 border-b bg-gradient-to-r from-[#8FA31E] to-[#556B2F] text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            {selectedUser && (
              <Button
                variant="ghost"
                className="md:hidden text-white"
                onClick={() => setShowUsersMobile(true)}
              >
                ⬅
              </Button>
            )}

            {selectedUser && (
              <h2 className="font-bold flex items-center gap-2">
                {selectedUser.name}
                <span
                  className={`w-2 h-2 rounded-full ${
                    onlineUsers.includes(selectedUser._id)
                      ? "bg-green-400"
                      : "bg-gray-300"
                  }`}
                />
              </h2>
            )}

            {typing && (
              <span className="text-xs text-yellow-200">
                typing…
              </span>
            )}
          </div>

          <div className="flex gap-2">
            {/* Profile Button */}
            <Button
              className="bg-white text-[#556B2F] hover:bg-[#EFF5D2]"
              onClick={() => navigate("/profile")}
            >
              👤 Profile
            </Button>

            {/* Logout Button */}
            <Button
              className="bg-[#C6D870] text-black hover:bg-[#C6D870]"
              onClick={() => logout()} 
            >
              Logout
            </Button>
          </div>
        </div>

        {/* CHAT */}
        {!selectedUser ? (
          <div className="hidden md:flex flex-1 items-center justify-center">
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/chatting-app-illustration-svg-download-png-6443454.png"
              className="w-[40%]"
            />
          </div>
        ) : (
          !showUsersMobile && (
            <div className="flex-1 flex flex-col">

              {/* MESSAGES */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EFF5D2]/70">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.fromSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-xs">
                      {m.file && isImage(m.file) && (
                        <img
                          src={m.file}
                          className="rounded-xl w-48 h-48 object-cover mb-1 shadow"
                        />
                      )}

                      {m.file && isVideo(m.file) && (
                        <video
                          src={m.file}
                          controls
                          className="rounded-xl w-48 h-48 object-cover mb-1 shadow"
                        />
                      )}

                      {m.text && (
                        <div
                          className={`px-4 py-2 rounded-2xl text-sm shadow ${
                            m.fromSelf
                              ? "bg-gradient-to-br from-[#8FA31E] to-[#556B2F] text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          {m.text}
                          
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <div className="p-4 border-t bg-gradient-to-r from-white to-[#EFF5D2] flex gap-2">
                <input
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message…"
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-[#8FA31E]"
                />

                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={handleFileUpload}
                />

                <Button variant="outline" onClick={() => fileInputRef.current.click()}>
                  📎
                </Button>

                <Button
                  className="bg-gradient-to-br from-[#8FA31E] to-[#556B2F] text-white"
                  onClick={handleSendMessage}
                >
                  🚀
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Users;
