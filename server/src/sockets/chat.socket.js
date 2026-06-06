const connectedUsers = {};

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    // USER JOINS
    socket.on("join", (userId) => {

      connectedUsers[userId] = socket.id;

      console.log("Connected Users:", connectedUsers);

    });

    // SEND MESSAGE
    socket.on("send_message", (data) => {

      console.log("Received:", data);

      io.emit(
        "receive_message",
        data
      );

    });

    // DISCONNECT
    socket.on("disconnect", () => {

      console.log("User Disconnected:", socket.id);

      for (const userId in connectedUsers) {

        if (
          connectedUsers[userId] === socket.id
        ) {
          delete connectedUsers[userId];
        }

      }

    });

  });

};

module.exports = socketHandler;