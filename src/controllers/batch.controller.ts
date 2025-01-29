import { Assignment } from "../models/assignments.model.js";
import { Batch } from "../models/batches.model.js";
import { Material } from "../models/materials.model.js";
import { StudentAcademicDetails } from "../models/studentAcademicDetails.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const createBatch = TryCatch(async (req, res, _) => {
  const { startingYear } = req.body;
  if (!startingYear) {
    throw new ApiError(400, "Please provide starting year");
  }
  const year = new Date(startingYear).getFullYear();

  const batch = new Batch({
    startingYear: new Date(year + "-01-01"),
  });

  const isBatchExists = await batch.validateStartingYear();

  if (!isBatchExists) {
    throw new ApiError(409, "Batch already exists");
  }

  await batch.save();
  res
    .status(200)
    .json(new ApiResponse(200, batch, "Batch created successfully"));
});

export const getAllRunningBatches = TryCatch(async (_, res, __) => {
  const batches = await Batch.find({ isCompleted: false });
  return res.status(200).json({
    success: true,
    data: batches,
    message: "Batches fetched successfully",
  });
});

export const updateBatchStartingYear = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const { startingYear } = req.body;

  const year = new Date(startingYear).getFullYear();

  console.log(new Date(year + "-01-01"));
  const isBatchAlredyExists = await Batch.findOne({
    startingYear: new Date(year + "-01-01"),
  });

  if (isBatchAlredyExists) {
    throw new ApiError(409, "Batch already exists");
  }

  const batch = await Batch.findByIdAndUpdate(
    _id,
    {
      startingYear: new Date(year + "-01-01"),
    },
    {
      new: true,
    }
  );

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, batch, "Batch starting year updated successfully")
    );
});

export const increaseSemesterOrCloseBatchIfAllSemesterCompleted = TryCatch(
  async (req, res, _) => {
    const { _id } = req.params;
    const batch = await Batch.findById(_id);

    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    if (batch.completedSemester == 8) {
      throw new ApiError(400, "Batch already finished successfully");
    }

    batch.completedSemester += 1;

    if (batch.completedSemester == 8) {
      batch.isCompleted = true;
    }

    const newBatch = await batch.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, newBatch, "Increased batch semester successfully")
      );
  }
);

export const deleteBatchSecurely = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const batch = await Batch.findById(_id);

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  const isAssignmentOfThisBatch = await Assignment.findOne({
    batch: batch._id,
  });
  const isMaterialOfThisBatch = await Material.findOne({
    batch: batch._id,
  });
  const isStudentOfThisBatch = await StudentAcademicDetails.findOne({
    batch: batch._id,
  });

  if (
    isStudentOfThisBatch ||
    isAssignmentOfThisBatch ||
    isMaterialOfThisBatch
  ) {
    throw new ApiError(
      400,
      "Batch  cannot be deleted. Have to delete from database"
    );
  }

  const deleted = await batch.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, deleted, "Batch deleted successfully"));
});
