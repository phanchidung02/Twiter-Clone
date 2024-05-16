import express from 'express';
import authRouters from './routes/authRouter.js';
import dotenv from 'dotenv';
import { connectMongoDB } from './model/connectDB.js';

const app = express();
dotenv.config();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use('/api/auth', authRouters);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongoDB();
});
