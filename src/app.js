import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Security & utils
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use("/api", limiter);

// Static serving for local video files (dev only)
app.use("/uploads", express.static("uploads"));
app.use("/thumbnails", express.static("thumbnails"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Oops, something went wrong.",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

export default app;
