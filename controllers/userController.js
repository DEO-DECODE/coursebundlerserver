import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import getDataUri from "../utils/dataUri.js";
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
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const changepassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(errorHandler("Please enter all the fields", 400));
    }
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(errorHandler("Your Password is incorrect", 401));
    }
    if (newPassword !== confirmPassword) {
      return next(errorHandler("Password doesn't matched", 401));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updateprofile = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name && !email) {
    return next(
      errorHandler("Please fill the fields which you want to update"),
      400
    );
  }
  if (name) {
    user.name = name;
  }
  if (email) {
    user.email = email;
  }
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
  const user = await user.findById(req.user._id);
};
export const addToPlaylist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.query.id);
    if (!course) {
      return next(errorHandler("Invalid course id", 404));
    }
    const isExist = user.playlist.find((item) => {
      if (item.course.toString() === Course._id.toString()) {
        return true;
      }
    });
    if (isExist) {
      return next(errorHandler("Course Already Exist", 409));
    }
    user.playlist.push({
      course: course._id,
      poster: course.poster.url,
    });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Course Added To The Playlist Successfully",
    });
  } catch (error) {
    next(error);
  }
};
