import express from "express";
import multer from "multer";
import { dashboardStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { videoUpload } from "../controllers/videoController.js";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get("/stats", protect, adminOnly, dashboardStats);
router.post(
  "/video/upload",
  protect,
  adminOnly,
  upload.single("video"),
  videoUpload
);

export default router;
