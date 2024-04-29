import { errorHandler } from "../utils/errorHandler.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { Course } from "../models/Course.js";
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
      return next(errorHandler("Please Add all fields", 400));
    }
    const file = req.file;
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await Course.create({
      title,
      description,
      category,
      createdBy,
      poster: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      message: "Course Added Successfully",
    });
  } catch (error) {
    next(errorHandler(error));
  }
};
export const addLectures = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const file = req.file;
    const dataUri = getDataUri(file);
    const myCloud = await cloudinary.v2.uploader.upload(dataUri.content, {
      resource_type: "video",
    });
    const course = await Course.findById(id);
    if (!course) {
      return next(errorHandler("No such course exists", 404));
    }
    course.lectures.push({
      title,
      description,
      video: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    course.numOfVideos = course.lectures.length;
    await course.save();
    res.status(200).json({
      sucess: true,
      message: "Lecture Added Successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    next(errorHandler(error));
  }
};
export const deleteCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);
    if (!course) {
      return next(errorHandler("No Such Course exists", 404));
    }
    await cloudinary.v2.uploader.destroy(course.poster.public_id);
    for (let i = 0; i < course.lectures.length; ++i) {
      const singleLecture = course.lectures[i];
      await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
        resource_type: "video",
      });
    }
    await course.remove();
    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    next(errorHandler(error));
  }
};
