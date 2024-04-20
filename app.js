import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
// Importing and Using Routes
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
const app = express();
config({
  path: "./config/config.env",
});
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
export default app;
