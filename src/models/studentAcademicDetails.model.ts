import { model, Schema } from "mongoose";
import { IStudentAcademicDetails } from "../types/models.js";
import { ApiError } from "../utils/api.error.js";
import { Subject } from "./subjects.model.js";
import { Result } from "./results.model.js";

const StudentAcademicDetailsSchema = new Schema<IStudentAcademicDetails>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    batch: {
      type: Schema.Types.ObjectId,
      ref: "batches",
      required: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "LT"],
    },
    status: {
      type: String,
      enum: ["Studying", "Graduated", "Left"],
      default: "Studying",
    },
  },
  {
    timestamps: true,
  }
);

StudentAcademicDetailsSchema.pre("save", async function (next) {
  try {
    const subjects = await Subject.find({
      department: this.department,
    });
    subjects.forEach(async (subject) => {
      await Result.create({
        student: this._id,
        subject: subject._id,
      });
    });
    next();
  } catch (error) {
    throw new ApiError();
  }
});

export const StudentAcademicDetails = model<IStudentAcademicDetails>(
  "studentAcademicDetails",
  StudentAcademicDetailsSchema
);
