import { model, Schema } from "mongoose";
import { IAssignment, IStudentAssignment } from "../types/models.js";

const StudentAssignmentSchema = new Schema<IStudentAssignment>(
  {
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "assignments",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "StudentAcademicDetails",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    marks: {
      type: Number,
      min: 0,
      max: 100,
    },
    url: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "batches",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "subjects",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AssignmentSchema.pre("findOneAndDelete", async function () {
  const assignmentInStudentAssignments = await StudentAssignment.find({
    assignment: this.getFilter()._id,
  });

  for (const assignment of assignmentInStudentAssignments) {
    await assignment.deleteOne();
  }
});

export const Assignment = model<IAssignment>("assignments", AssignmentSchema);
export const StudentAssignment = model<IStudentAssignment>(
  "studentAssignments",
  StudentAssignmentSchema
);
