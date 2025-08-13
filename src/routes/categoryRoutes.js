import express from "express";
import {
  createCategory,
  listCategories,
} from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", listCategories);
router.post("/", protect, adminOnly, createCategory);

export default router;
