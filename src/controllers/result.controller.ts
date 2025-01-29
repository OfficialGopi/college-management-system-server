import { Result } from "../models/results.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const createResult = TryCatch(async (req, res) => {
  const { result, pointsAchieved } = req.body;
  if (!result) {
    throw new ApiError(400, "Please provide result Id");
  }
  const newResult = await Result.findByIdAndUpdate(
    result,
    {
      pointsAchieved,
      saved: true,
    },
    {
      new: true,
    }
  );
  if (!newResult) {
    throw new ApiError(404, "Result not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, newResult, "Result updated successfully"));
});

export const deleteResult = TryCatch(async (req, res) => {
  const { result } = req.params;
  if (!result) {
    throw new ApiError(400, "Please provide result Id");
  }
  const newResult = await Result.findById(
    result,
    {
      pointsAchieved: 0,
      saved: false,
    },
    {
      new: true,
    }
  );
  res
    .status(200)
    .json(new ApiResponse(200, newResult, "Result deleted successfully"));
});

export const getResultsByStudent = TryCatch(async (req, res) => {
  const { student } = req.params;
  if (!student) {
    throw new ApiError(400, "Please provide student Id");
  }
  const results = await Result.find({ student });
  if (!results.length) {
    throw new ApiError(404, "No results found");
  }
  res.status(200).json(new ApiResponse(200, results, "Results found"));
});

// export const getResultsBySubjectAndBatch = TryCatch(async (req, res) => {
//   const { teacher } = req.params;
//   const { subject, batch } = req.body;
// });
