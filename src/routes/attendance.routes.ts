import { Router } from "express";
import {
  closeAttendancePortal,
  createAttendanceSheet,
  deleteAttendanceSheet,
  getAllAttendanceSheets,
  giveAttendenceToStudents,
  openAttendancePortal,
} from "../controllers/attendance.controller.js";
const attendance = Router();

attendance.post("/", createAttendanceSheet);
attendance.post("/getallattendancesheets", getAllAttendanceSheets);
attendance.post("/giveattendencetostudents", giveAttendenceToStudents);
attendance.delete("/:attendanceId", deleteAttendanceSheet);
attendance.patch("/close/:attendance", closeAttendancePortal);
attendance.patch("/open/:attendance", openAttendancePortal);

export { attendance };
