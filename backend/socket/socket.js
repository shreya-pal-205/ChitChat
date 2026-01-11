let onlineUsers = {};
const Message = require("../models/Message");

exports.initSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // USER ONLINE
    socket.on("user-online", (userId) => {
      onlineUsers[userId] = socket.id;
      console.log("Online users:", onlineUsers);
    });




    // SEND TEXT MESSAGE
    socket.on("send-message", async (data) => {
      try {
        const message = await Message.create({
          sender: data.sender,
          receiver: data.receiver,
          text: data.text,
        });

        const receiverSocket = onlineUsers[data.receiver];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive-message", message);
        }
      } catch (err) {
        console.error(err);
      }
    });





    // SEND FILE / VIDEO MESSAGE
    socket.on("send-file", (message) => {
      const receiverSocket = onlineUsers[message.receiver];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive-message", message);
      }
    });





    //TYPING INDICATOR (START)
    socket.on("typing", ({ sender, receiver }) => {
      const receiverSocket = onlineUsers[receiver];
      if (receiverSocket) {
        io.to(receiverSocket).emit("user-typing", {
          sender,
        });
      }
    });





    // TYPING INDICATOR (STOP)
    socket.on("stop-typing", ({ sender, receiver }) => {
      const receiverSocket = onlineUsers[receiver];
      if (receiverSocket) {
        io.to(receiverSocket).emit("user-stop-typing", {
          sender,
        });
      }
    });





    //DISCONNECT
    socket.on("disconnect", () => {
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      console.log("Client disconnected:", socket.id);
    });
  });
};
