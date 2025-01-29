import { model, Schema } from "mongoose";
import { IResult } from "../types/models.js";

const ResultSchema = new Schema<IResult>(
  {
    student: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "StudentAcademicDetails",
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "subjects",
      required: true,
    },
    pointsAchieved: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    saved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ResultSchema.virtual("grade").get(function () {
  if (this.pointsAchieved == 10) {
    return "O";
  }
  if (this.pointsAchieved == 9) {
    return "E";
  }
  if (this.pointsAchieved == 8) {
    return "A";
  }
  if (this.pointsAchieved == 7) {
    return "B";
  }
  if (this.pointsAchieved == 6) {
    return "C";
  }
  if (this.pointsAchieved == 5) {
    return "D";
  }
  if (this.pointsAchieved < 5) {
    return "F";
  }
});

export const Result = model<IResult>("results", ResultSchema);
