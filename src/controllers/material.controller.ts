import { Batch } from "../models/batches.model.js";
import { Material } from "../models/materials.model.js";
import { Subject } from "../models/subjects.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const uploadMaterial = TryCatch(async (req, res, next) => {
  const { batch, subject, title, description } = req.body;

  if (!batch || !subject || !title || !description) {
    throw new ApiError(400, "All fields must be provided");
  }
  const isBatchExist = await Batch.findById(batch);
  if (!isBatchExist) {
    throw new ApiError(404, "Batch not found");
  }
  const isSubjectExist = await Subject.findById(subject);
  if (!isSubjectExist) {
    throw new ApiError(404, "Subject not found");
  }
  const files = req.files as any[];

  if (!files || !files.length) {
    throw new ApiError(400, "No files provided");
  }
  const uploadedUrl: string[] = [];
  for (const file of files) {
    const uploadedFile = await uploadOnCloudinary(file.path);
    if (!uploadedFile) {
      throw new ApiError(500, "Failed to upload file");
    }
    uploadedUrl.push(uploadedFile.url);
  }
  const material = new Material({
    batch: batch,
    subject: subject,
    title: title,
    description: description,
    materialUrl: uploadedUrl,
  });
  const uoloadedMaterial = await material.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, uoloadedMaterial, "Material uploaded successfully")
    );
});

export const deleteMaterial = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const material = await Material.findByIdAndDelete(_id);
  if (!material) {
    throw new ApiError(404, "Material not found");
  }
  res.status(200).json(new ApiResponse(200, "Material deleted successfully"));
});

export const getMaterials = TryCatch(async (req, res, next) => {
  const { batch, subject } = req.body;
  if (!batch || !subject) {
    throw new ApiError(400, "Batch and subject must be provided");
  }
  const isBatchExist = await Batch.findById(batch);
  if (!isBatchExist) {
    throw new ApiError(404, "Batch not found");
  }
  const isSubjectExist = await Subject.findById(subject);
  if (!isSubjectExist) {
    throw new ApiError(404, "Subject not found");
  }
  const materials = await Material.find({ batch: batch, subject: subject });
  res
    .status(200)
    .json(new ApiResponse(200, materials, "Materials fetched successfully"));
});
