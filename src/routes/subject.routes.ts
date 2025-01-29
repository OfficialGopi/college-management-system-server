import { Router } from "express";
import {
  addTeacherToSubject,
  deleteSubject,
  getSubject,
  getSubjectsBySemesterAndDepartment,
  postSubject,
  removeTeacherFromSubject,
  updateSubject,
} from "../controllers/subject.controller.js";

const subject = Router();

subject.get("/", getSubject);
subject.get("/get", getSubjectsBySemesterAndDepartment);

subject.post("/", postSubject);

subject.put("/teacher/:_id", addTeacherToSubject);
subject.put("/:_id", updateSubject);

subject.delete("/teacher/:_id", removeTeacherFromSubject);
subject.delete("/:_id", deleteSubject);

export { subject };
