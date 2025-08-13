import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function protect(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) throw new Error("User not found");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
}
