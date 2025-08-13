import express from "express";
import {
  listVideos,
  streamVideo,
  videoUpload,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listVideos);
router.get("/stream/:id", protect, streamVideo);

export default router;
