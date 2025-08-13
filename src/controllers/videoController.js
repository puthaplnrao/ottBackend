import fs from "fs";
import path from "path";
import Video from "../models/Video.js";
import {
  getObjectStreamWithRange,
  headObject,
} from "../config/cloudStorage.js";
import slugify from "slugify";

export async function listVideos(req, res) {
  try {
    const videos = await Video.find().populate("categories", "name slug");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function streamVideo(req, res) {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const range = req.headers.range;
    if (!range) return res.status(400).send("Requires Range header");

    if (video.storageProvider === "LOCAL") {
      const videoPath = path.resolve(`uploads/${video.fileKey}`);
      const videoSize = fs.statSync(videoPath).size;

      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": video.contentType,
      };
      res.writeHead(206, headers);
      fs.createReadStream(videoPath, { start, end }).pipe(res);
    } else {
      // S3 Streaming
      const head = await headObject(video.fileKey);
      const headers = {
        "Content-Range": range,
        "Accept-Ranges": "bytes",
        "Content-Length": head.ContentLength,
        "Content-Type": video.contentType,
      };
      res.writeHead(206, headers);
      const stream = getObjectStreamWithRange(video.fileKey, range);
      stream.pipe(res);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function videoUpload(req, res) {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadsDir = path.resolve("uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const destPath = path.join(uploadsDir, file.filename);
    fs.copyFileSync(file.path, destPath);

    const video = new Video({
      title,
      slug: slugify(title, { lower: true }),
      description,
      storageProvider: "LOCAL",
      fileKey: file.filename,
      user: req.user.id,
      contentType: file.mimetype,
    });

    await video.save();

    res.status(201).json({ message: "Video uploaded", video });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
