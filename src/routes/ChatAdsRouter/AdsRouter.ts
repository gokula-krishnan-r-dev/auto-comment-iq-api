import { Request, Response } from "express";
import Ad from "../../models/ad.model";

const express = require("express");
const AdsRouter = express.Router();
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

AdsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const ads = await Ad.find().populate("user");
    res.status(200).json(ads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET ad by ID
AdsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findById(req.params.id).populate("user");
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

AdsRouter.get("/room/:roomId", async (req: Request, res: Response) => {
  try {
    const ads = await Ad.find({ roomId: req.params.roomId }).populate("user");
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

AdsRouter.post(
  "/",
  upload.array("files", 3), // Assuming you're using "files" as the field name in your form
  async (req: any, res: Response) => {
    try {
      const files = req.files;

      // Assuming you have other fields in req.body for the ad details
      const ads_company_logo = files[0].location; // Assuming the first file is the logo
      const ads_thumbnail = files[1].location; // Assuming the second file is the thumbnail
      const url = files[2].location; // Assuming the third file is the url
      // Create a new Ad instance
      const newAd = new Ad({
        ...req.body,
        ads_company_logo,
        ads_thumbnail,
        url,
      });

      // Save the Ad instance to the database
      const savedAd = await newAd.save();

      res.status(201).json(savedAd);
    } catch (error) {
      console.error("Error saving ad:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default AdsRouter;
