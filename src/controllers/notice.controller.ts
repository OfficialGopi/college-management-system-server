import { Notice } from "../models/notices.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const createNotice = TryCatch(async (req, res, next) => {
  const { title, details } = req.body;
  if (!title || !details) {
    throw new ApiError(400, "All fields must be provided");
  }
  const files = req.files as any[];

  const uploadedFiles = [];
  if (files.length > 0) {
    for (const file of files) {
      const uploadedFile = await uploadOnCloudinary(file.path);
      if (!uploadedFile) {
        throw new ApiError(500, "Failed to upload file");
      }
      uploadedFiles.push(uploadedFile.url);
    }
  }
  const notice = await Notice.create({
    title,
    details,
    attachments: uploadedFiles,
  });
  res
    .status(201)
    .json(new ApiResponse(200, notice, "Notice created successfully"));
});

export const getAllNoticesToday = TryCatch(async (_, res, __) => {
  const notices = await Notice.find({
    date: new Date(new Date().toISOString().split("T")[0]),
  });
  if (!notices) {
    throw new ApiError(404, "No notices found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, notices, "Notices fetched successfully"));
});

export const deleteNotices = TryCatch(async (req, res, next) => {
  const { notice } = req.params;
  const noticeToDelete = await Notice.findByIdAndDelete(notice);
  if (!noticeToDelete) {
    throw new ApiError(404, "Notice not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, noticeToDelete, "Notice deleted successfully"));
});
