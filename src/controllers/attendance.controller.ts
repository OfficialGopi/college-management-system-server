import { Attendance, StudentAttendance } from "../models/attendances.model.js";
import { Batch } from "../models/batches.model.js";
import { Subject } from "../models/subjects.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const createAttendanceSheet = TryCatch(async (req, res, next) => {
  const { batch, subject, date } = req.body;
  if (!batch || !subject || !date) {
    throw new ApiError(400, "All fields must be provided");
  }
  const isBatchExist = await Batch.findOne(batch);
  if (!isBatchExist) {
    throw new ApiError(404, "Batch not found");
  }
  const isSubjectExist = await Subject.findOne(subject);
  if (!isSubjectExist) {
    throw new ApiError(404, "Subject not found");
  }
  const isAttendenceSheetExist = await Attendance.findOne({
    batch,
    subject,
    date: new Date(date.spilit("T")[0]),
  });
  if (isAttendenceSheetExist) {
    throw new ApiError(
      400,
      "Attendance sheet already exists for this batch and subject on this"
    );
  }
  const newAttendanceSheet = await Attendance.create({
    batch,
    subject,
    date: new Date(date.split("T")[0]),
  });
  if (!newAttendanceSheet) {
    throw new ApiError(500, "Failed to create attendance sheet");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newAttendanceSheet,
        "Attendance sheet created successfully"
      )
    );
});

export const getAllAttendanceSheets = TryCatch(async (req, res, __) => {
  const { batch, subject } = req.body;
  if (!batch && !subject) {
    throw new ApiError(400, "Batch and subject are required");
  }
  const attendanceSheets = await Attendance.find({
    batch,
    subject,
  })
    .populate("batch")
    .populate("subject");
  if (!attendanceSheets) {
    throw new ApiError(404, "Attendance sheet not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, attendanceSheets, "Attendance sheets fetched"));
});

export const deleteAttendanceSheet = TryCatch(async (req, res, __) => {
  const { attendanceId } = req.params;
  const isAttendenceExists = await Attendance.findById(attendanceId);
  if (!isAttendenceExists) {
    throw new ApiError(404, "Attendance sheet not found");
  }
  const deletedAttendence = await Attendance.findByIdAndDelete(attendanceId);
  if (!deletedAttendence) {
    throw new ApiError(500, "Failed to delete attendance sheet");
  }
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedAttendence,
        "Attendance sheet deleted successfully"
      )
    );
});

export const closeAttendancePortal = TryCatch(async (req, res, __) => {
  const { attendance } = req.params;
  const attendancePortal = await Attendance.findById(attendance);
  if (!attendancePortal) {
    throw new ApiError(404, "Attendance not found");
  }
  if (attendancePortal.isAttendencePortalClose) {
    throw new ApiError(400, "Attendance portal is already closed");
  }
  attendancePortal.isAttendencePortalClose = true;
  const updatedAttendancePortal = await attendancePortal.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAttendancePortal,
        "Attendance portal closed successfully"
      )
    );
});

export const openAttendancePortal = TryCatch(async (req, res, __) => {
  const { attendance } = req.params;
  const attendancePortal = await Attendance.findById(attendance);
  if (!attendancePortal) {
    throw new ApiError(404, "Attendance not found");
  }
  if (!attendancePortal.isAttendencePortalClose) {
    throw new ApiError(400, "Attendance portal is already opened");
  }
  attendancePortal.isAttendencePortalClose = false;
  const updatedAttendancePortal = await attendancePortal.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedAttendancePortal,
        "Attendance portal opened successfully"
      )
    );
});

export const giveAttendenceToStudents = TryCatch(async (req, res, __) => {
  const { student, attendance, isPresent = false } = req.body;
  const attendancePortal = await Attendance.findById(attendance);
  if (!attendancePortal) {
    throw new ApiError(404, "Attendance not found");
  }
  const studentAttendance = await StudentAttendance.findOne({
    student,
    attendance,
  });
  if (!studentAttendance) {
    throw new ApiError(400, "Attendence record of student not found");
  }
  studentAttendance.isPresent = isPresent;

  const savedStudentAttendance = await studentAttendance.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedStudentAttendance,
        "Attendance of student recorded successfully"
      )
    );
});
