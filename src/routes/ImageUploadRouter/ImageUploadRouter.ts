const express = require("express");
const ImageUploadRouter = express.Router();

const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const multerS3 = require("multer-s3");
const region = "ap-south-1";
const path = require("path");
const bucketName = process.env.BUCKET_NAME || "autocommentiq";
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: any, file: any, cb: any) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

ImageUploadRouter.post(
  "/upload",
  upload.single("image"),
  async (req: any, res: any) => {
    try {
      const file = req.file;
      const filePath = file.location;
      res.status(200).json({ filePath });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);

export default ImageUploadRouter;
