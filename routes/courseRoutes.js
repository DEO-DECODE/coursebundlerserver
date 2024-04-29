import express from "express";
const router = express.Router();
import { createCourse, addLectures, deleteCourse } from "../controllers/courseController.js";
import { isAuthenticated, autherizedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
router.post(
  "/createcourse",
  isAuthenticated,
  autherizedAdmin,
  singleUpload,
  createCourse
);
router.post(
  "/course/:id",
  isAuthenticated,
  autherizedAdmin,
  singleUpload,
  addLectures
);
router.delete(
  "/course/:id",
  isAuthenticated,
  autherizedAdmin,
  singleUpload,
  deleteCourse
);
export default router;
