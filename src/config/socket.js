const socketIo = require('socket.io');
const { patch } = require('../routes/loveRequestRoutes');

const socketConnection = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected to socket IO");

    socket.on("sendMessage", ({ senderId, receiverId, message }) => {
      io.emit("receiveMessage", { senderId, receiverId, message });
      console.log("Message sent:", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketConnection;