import { Server } from "socket.io";
import {
  createLogger,
  format as _format,
  transports as _transports,
} from "winston";

import "./config.js";
import connectDB from "./utils/db.js";
import app from "./app.js";

const logger = createLogger({
  level: "info",
  format: _format.json(),
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new _transports.File({ filename: "error.log", level: "error" }),
    new _transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new _transports.Console({
      format: _format.combine(_format.colorize(), _format.simple()),
    })
  );
}

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

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_HOST,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  socket.userId = userId;
  socket.on("join_room", (room) => {
    logger.info(`User ${socket.userId} joining room ${room}`);
    socket.join(room);

    // Get the clients in a room
    const clientsInRoom = io.sockets.adapter.rooms.get(room);

    // Check if there are clients in the room
    if (clientsInRoom) {
      // Get an array of userIds from the clients in the room
      const userIdsInRoom = [...clientsInRoom].map(
        (clientId) => io.sockets.sockets.get(clientId).userId
      );

      // Log the userIds
      logger.info(`Users in room ${room}: ${userIdsInRoom.join(", ")}`);
    } else {
      logger.info(`No users in room ${room}`);
    }
  });

  socket.on("leave_room", (room) => {
    logger.info(`User ${socket.userId} leaving room ${room}`);
    socket.leave(room);
  });

  socket.on("sendMessage", ({ _id, senderId, body, createdAt, roomId }) => {
    logger.info(`User ${senderId} sending message to room ${roomId}: ${body}`);

    io.to(roomId).emit("receiveMessage", {
      senderId,
      body,
      createdAt,
      _id,
    });
  });

  socket.on("disconnect", () => {
    logger.info(`Socket disconnected: ${socket.userId}`);
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.code);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
