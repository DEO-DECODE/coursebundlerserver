import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri";
import { errorHandler } from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;
    if (!name || !password || !email || !file)
      return next(errorHandler("Please Enter all fields", 400));
    let user = await User.findOne({ email });
    if (user) {
      return next(errorHandler("User already exists", 409));
    }
    const dataUri = getDataUri(file);
    const mycloud = cloudinary.v2.uploader.upload(dataUri.content);
    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });
    sendToken(res, user, "Register Successfully", 200);
  } catch (error) {
    next(errorHandler(error));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!password || !email)
      return next(errorHandler("Please Enter all fields", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(errorHandler("Incorrect Email or Password", 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(errorHandler("Incorrect Email or Password", 401));
    }
    sendToken(res, user, `Welcome Back ${user.name}`, 201);
  } catch (error) {
    next(errorHandler(error));
  }
};
export const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
};
