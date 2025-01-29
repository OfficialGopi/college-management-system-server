import { Router } from "express";
import {
  createAssigment,
  deleteAssignment,
  getAllAssignmentsBySubjectAndBatch,
  getAllSubmittedAssignmentsByStudent,
  readAssignmentAndGiveMarksComplete,
  removeAttachmentsByStudents,
  submitAssignmentByStudent,
  updateAssignment,
} from "../controllers/assignment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const assignment = Router();

assignment.post("/", createAssigment);
assignment.post(
  "/getallassignmentsbysubjectandbatch",
  getAllAssignmentsBySubjectAndBatch
);
assignment.post(
  "/getallsubmittedassignmentsbystudent/:assignment",
  getAllSubmittedAssignmentsByStudent
);
assignment.patch(
  "/submitassignment",
  upload.array("assignments"),
  submitAssignmentByStudent
);
assignment.patch(
  "/readassignmentandgivemarkscomplete/:studentAssignmentId",
  readAssignmentAndGiveMarksComplete
);
assignment.put("/:_id", updateAssignment);
assignment.delete("/:_id", deleteAssignment);
assignment.delete("/removeAttachmentsByStudents", removeAttachmentsByStudents);

export { assignment };
