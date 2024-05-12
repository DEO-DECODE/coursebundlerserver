import express from "express";
import {
  login,
  logout,
  register,
  changepassword,
  updateprofile,
  addToPlaylist,
  forgotPassword,
  reserPassword,
  updateProfilePicture
} from "../controllers/userController.js";
import { isAuthenticated, autherizedAdmin } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.put("/changepassword", isAuthenticated, changepassword);
router.put("/updateprofile", isAuthenticated, updateprofile);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", reserPassword);
router.post("/addtoplaylist", isAuthenticated, addToPlaylist);
router.put(
  "/updateprofilepicture",
  isAuthenticated,
  singleUpload,
  updateProfilePicture
);
export default router;
