import { model, Schema } from "mongoose";
import { IBatch } from "../types/models.js";
import { ApiError } from "../utils/api.error.js";

const BatchSchema = new Schema<IBatch>(
  {
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedSemester: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      default: 1,
    },
    startingYear: {
      type: Date,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

BatchSchema.methods.validateStartingYear = async function () {
  try {
    const batch = await Batch.findOne({ startingYear: this.startingYear });
    return batch ? false : true;
  } catch (error) {
    throw new ApiError();
  }
};

export const Batch = model<IBatch>("batches", BatchSchema);
