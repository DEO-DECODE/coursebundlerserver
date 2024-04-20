import app from "./app.js";
import { connectDB } from "./config/database.js";
connectDB();
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Ineternal Server Error";
  return res.statusCode(statusCode).json({
    sucess: false,
    message,
    statusCode,
  });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is runnig on Port : ${process.env.PORT}`);
});
