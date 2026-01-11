import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // ✅ SINGLE SOURCE

  useEffect(() => {
    if (!user) return;

    const newSocket = io("https://chitchat-backend-9ns3.onrender.com", {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("user-online", user._id);

    newSocket.on("online-users", (users) => {
      setOnlineUsers(users); // [id1, id2]
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
