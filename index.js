import app from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
connectDB();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ineternal Server Error";
  return res.statusCode(statusCode).json({
    sucess: false,
    message,
    statusCode,
  });
});
const PORT= process.env.PORT||8000;
app.listen(process.env.PORT, () => {
  console.log(`Server is runnig on Port : ${process.env.PORT}`);
});
