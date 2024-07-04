"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const RoomStroyRoute = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const fs = require("fs");
const multerS3 = require("multer-s3");
const region = "ap-south-1";
const path = require("path");
const bucketName = process.env.BUCKET_NAME;
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
RoomStroyRoute.post("/upload/file", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.file);
        const file = req.file;
        const fileName = file.key;
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: file,
        });
        // // Assuming you are storing file information in the StoryModel
        // const newStory = new StoryModel({
        //   ...req.body,
        //   url: "sdsfdsf",
        //   type: "image",
        //   file: req.file, // Save the file details in the StoryModel
        // });
        // const savedStory = await newStory.save();
        // console.log("File uploaded successfully:", savedStory);
        // res.status(200).json({
        //   success: true,
        //   message: "File uploaded successfully",
        //   data: savedStory,
        // });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
}));
RoomStroyRoute.get("/", (req, res) => {
    res.send("Story Route");
});
exports.default = RoomStroyRoute;
//# sourceMappingURL=RoomStroyRoute.js.map