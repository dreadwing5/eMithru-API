import "./config.js";
import connectDB from "./utils/db.js";
import app from "./app.js";
import SocketManager from "./utils/socketManager.js";
import socketController from "./controllers/socketController.js";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});

connectDB();

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = SocketManager.createServer(server, {
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  socket.userId = userId;
  socketController.handleEvents(socket);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.code);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
