import express from "express";
import dotenv from "dotenv";
import  { connectDB } from "./libs/db.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { protectedRouted } from "./middlewares/authMiddlewares.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());

//public routes
app.use('/api/auth', authRoutes);

//private routes
app.use(protectedRouted);
app.use('/api/user', userRoutes);
connectDB().then(() => {
  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
});