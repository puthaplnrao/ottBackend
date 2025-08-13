import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    storageProvider: { type: String, enum: ["LOCAL", "S3"], default: "LOCAL" },
    fileKey: { type: String, required: true },
    contentType: { type: String, default: "video/mp4" },
    duration: Number,
    thumbnailUrl: String,
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    isPremium: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
