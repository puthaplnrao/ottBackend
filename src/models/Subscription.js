import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["basic", "premium"], required: true },
    status: {
      type: String,
      enum: ["created", "active", "canceled", "expired"],
      default: "created",
    },
    startDate: Date,
    endDate: Date,
    provider: String,
    providerRef: String,
    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
