const express = require("express");
const cloudinary = require("../config/cloudinary");
const upload = require("../middlewares/upload.middleware");

const uploadRoute = express.Router();

const FOLDER_NAME = "WD_6_30";

uploadRoute.post("/upload", upload.array("images", 5), async (req, res) => {
  try {
    // console.log(req.files);
    console.log(req.files.length);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: FOLDER_NAME,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      message: "Images uploaded successfully",
      images: results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      })),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});
uploadRoute.delete("/delete/:public_id", async (req, res) => {
  try {
    const publicId = req.params.public_id;

    await cloudinary.uploader.destroy(publicId);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = uploadRoute;
