import express from "express";
import {
  createSubscription,
  listSubscriptions,
} from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, listSubscriptions);
router.post("/", protect, createSubscription);

export default router;
