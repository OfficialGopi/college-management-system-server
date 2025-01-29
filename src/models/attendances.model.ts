import { model, Schema } from "mongoose";
import { IAttendance, IStudentAttendance } from "../types/models.js";
import { Subject } from "./subjects.model.js";
import { StudentAcademicDetails } from "./studentAcademicDetails.model.js";

const StudentAttendanceSchema = new Schema<IStudentAttendance>(
  {
    attendence: {
      type: Schema.Types.ObjectId,
      ref: "attendances",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "StudentAcademicDetails",
      required: true,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceSchema = new Schema<IAttendance>(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "batches",
      required: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subjects",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    isAttendencePortalClose: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.pre("save", async function (next) {
  if (!this.isNew) {
    next();
  }
  const subject = await Subject.findById(this.subject);
  if (!subject) {
    throw new Error("Invalid subject");
  }
  const students = await StudentAcademicDetails.find({
    batch: this.batch,
    department: subject.department,
  }).select("_id");
  for (const student of students) {
    await StudentAttendance.create({
      attendence: this._id,
      student: student._id,
    });
  }
  next();
});

AttendanceSchema.pre("findOneAndDelete", async function () {
  await StudentAttendance.deleteMany({
    attendence: this.getFilter()._id,
  });
});

export const Attendance = model<IAttendance>("attendences", AttendanceSchema);
export const StudentAttendance = model<IStudentAttendance>(
  "studentattendences",
  StudentAttendanceSchema
);
