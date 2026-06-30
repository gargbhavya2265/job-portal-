import express from "express";
import {
  forgotPassword,
  loginUser,
  registerUser,
  resetPassword,
} from "../controllers/auth.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/register",
  uploadFile,
  (req, res, next) => {
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Headers object:", req.headers);
    console.log("Content-Type:", req.get("content-type"));
    console.log("Body:", req.body);
    console.log("File:", req.file);
    next();
  },
  registerUser
);

router.post("/login", loginUser);
router.post("/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);

export default router;