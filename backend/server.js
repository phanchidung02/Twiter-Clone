import express from 'express';
import authRouters from './routes/authRouter.js';
import dotenv from 'dotenv';
import { connectMongoDB } from './model/connectDB.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const port = process.env.PORT || 8000;
app.use(
  cors({
    origin: 'http://localhost:5173', // Địa chỉ frontend của bạn
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRouters);
app.use('/api/', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/notification', notificationRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongoDB();
});
