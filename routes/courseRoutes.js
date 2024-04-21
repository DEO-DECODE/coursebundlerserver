import express from "express";
const router = express.Router();
import { isAuthenticated, autherizedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
router.post(
  "/createcourse",
  isAuthenticated,
  autherizedAdmin,
  singleUpload,
  createCourse
);
export default router;
