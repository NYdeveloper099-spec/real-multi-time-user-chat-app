const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

const Message = require("./models/Message");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const socketHandler = require("./sockets/chat.socket");

const userRoutes = require("./routes/user.routes");

const messageRoutes = require("./routes/message.routes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);

// ROUTES
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use(
  "/api/messages",
  messageRoutes
);


// CREATE HTTP SERVER
const server = http.createServer(app);


// SOCKET SERVER
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


// HANDLE SOCKETS
socketHandler(io);


const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});