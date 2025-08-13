import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },
    status: {
      type: String,
      enum: ["inactive", "active", "expired"],
      default: "inactive",
    },
    start: Date,
    expiry: Date,
    provider: String,
    providerRef: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: subscriptionSchema,
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    history: [
      {
        video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
        at: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
