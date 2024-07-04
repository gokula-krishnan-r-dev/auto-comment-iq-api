"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const ad_model_1 = __importDefault(require("../../models/ad.model"));
const express = require("express");
const AdsRouter = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const multerS3 = require("multer-s3");
const region = "ap-south-1";
const path = require("path");
const bucketName = process.env.BUCKET_NAME || "auto-comment-ads";
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
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
AdsRouter.get("/", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const ads = yield ad_model_1.default.find().populate("user");
      res.status(200).json(ads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
// GET ad by ID
AdsRouter.get("/:id", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const ad = yield ad_model_1.default
        .findById(req.params.id)
        .populate("user");
      if (!ad) {
        return res.status(404).json({ error: "Ad not found" });
      }
      res.status(200).json(ad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
AdsRouter.get("/room/:roomId", (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const ads = yield ad_model_1.default
        .find({ roomId: req.params.roomId })
        .populate("user");
      res.status(200).json(ads);
    } catch (error) {
      console.error("Error fetching ads:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })
);
AdsRouter.post(
  "/",
  upload.array("files", 3), // Assuming you're using "files" as the field name in your form
  (req, res) =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const files = req.files;
        // Assuming you have other fields in req.body for the ad details
        const ads_company_logo = files[0].location; // Assuming the first file is the logo
        const ads_thumbnail = files[1].location; // Assuming the second file is the thumbnail
        const url = files[2].location; // Assuming the third file is the url
        // Create a new Ad instance
        const newAd = new ad_model_1.default(
          Object.assign(Object.assign({}, req.body), {
            ads_company_logo,
            ads_thumbnail,
            url,
          })
        );
        // Save the Ad instance to the database
        const savedAd = yield newAd.save();
        res.status(201).json(savedAd);
      } catch (error) {
        console.error("Error saving ad:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
);
exports.default = AdsRouter;
//# sourceMappingURL=AdsRouter.js.map
