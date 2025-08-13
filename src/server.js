import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;
const SERVER_HOST = process.env.SERVER_HOST || "localhost";
const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || "http";

(async () => {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () =>
    console.log(`API running on ${SERVER_PROTOCOL}://${SERVER_HOST}:${PORT}`)
  );
})();
