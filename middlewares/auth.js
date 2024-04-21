import JWT from "jsonwebtoken";
import { errorHandler } from "../utils/errorHandler.js";
import { User } from "../models/User.js";
export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(errorHandler("User must be logged In!", 401));
  }
  const decode = await JWT.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode._id);
  next();
};
export const autherizedAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(errorHandler("Only Admin can access this route", 403));
  }
  next();
};
