import express, { json } from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";

//routes

import userRouter from "./routes/userRoutes.js";
// import conversationRouter from "./routes/conversationRoutes.js";
import meetingRouter from "./routes/meetingRoutes.js";
import studentRouter from "./routes/Student/studentRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import mentorRouter from "./routes/Student/mentorRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import campusBuddyRouter from "./routes/CampusBuddy/campusBuddy.js";
import privateConversationRouter from "./routes/Conversation/privateConversationRoutes.js";
import messageRouter from "./routes/Conversation/messageRoutes.js";
import threadRouter from "./routes/threadRoutes.js";
import academicRouter from "./routes/Student/academicCRUD.js";
// import sendAttendanceNotifications from "./routes/Student/sendEmail.js";

const app = express();

//1) GLOBAL MIDDLEWARE
app.use(cors());

//Set security HTTP headers

app.use(helmet());

//Development logging

app.use(morgan("dev"));

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	//allow 100 requests per hour per IP
	message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//Body parser, reading data from body into req.body
app.use(
	json({
		limit: "10kb",
	})
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//TODO : Find out how can we sanitize request, this library is outdated
// Data sanitization against XSS
// app.use(xss());

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/meetings", meetingRouter);
app.use("/api/mentors", mentorRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/campus-buddy", campusBuddyRouter);
app.use("/api/private-conversations", privateConversationRouter);
app.use("/api/threads", threadRouter);
app.use("/api/students", studentRouter);
app.use("/api/students/attendance", attendanceRouter);
app.use("/api/students/academic", academicRouter);

// sendAttendanceNotifications();
/* app.use("/api/academic", academicRouter);
app.use("/api/admission", admissionRouter); */

//Handle non-existing routes
app.all("*", (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Error handling middleware
app.use(globalErrorHandler);

export default app;
