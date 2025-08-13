import User from "../models/User.js";
import Video from "../models/Video.js";
import Category from "../models/Category.js";

export async function dashboardStats(req, res) {
  try {
    const users = await User.countDocuments();
    const videos = await Video.countDocuments();
    const categories = await Category.countDocuments();
    res.json({ users, videos, categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
