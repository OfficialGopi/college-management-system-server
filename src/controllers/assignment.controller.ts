import { Assignment, StudentAssignment } from "../models/assignments.model.js";
import { Batch } from "../models/batches.model.js";
import { StudentAcademicDetails } from "../models/studentAcademicDetails.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const createAssigment = TryCatch(async (req, res, next) => {
  const {
    batch,
    subject,
    title,
    description,
    multiple = false,
    dueDate,
  } = req.body;

  if (!batch || !subject || !title || !description) {
    throw new ApiError(400, "All fields must be provided");
  }

  const isBatchExist = await Batch.findOne(batch);
  const isSubjectExist = await Batch.findOne(subject);

  if (!isBatchExist || !isSubjectExist) {
    throw new ApiError(404, "Batch or Subject not found");
  }

  const assignment = await Assignment.create({
    batch,
    subject,
    title,
    description,
    multiple,
    dueDate: new Date(dueDate),
  });

  res
    .status(200)
    .json(new ApiResponse(200, assignment, "Assignment created successfully"));
});

export const deleteAssignment = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const assignment = await Assignment.findByIdAndDelete(_id);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }
  res.status(200).json(new ApiResponse(200, "Assignment deleted successfully"));
});

export const updateAssignment = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const {
    title,
    description,
    isClosed = false,
    multiple = false,
    dueDate,
  } = req.body;
  if (!_id) {
    throw new ApiError(400, "Assignment ID is required");
  }
  const assignment = await Assignment.findById(_id);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }
  if (title && title != assignment.title) {
    assignment.title = title;
  }
  if (description && description != assignment.description) {
    assignment.description = description;
  }
  if (multiple) {
    assignment.multiple = true;
  } else {
    assignment.multiple = false;
  }
  if (dueDate && dueDate != assignment.dueDate) {
    assignment.dueDate = new Date(dueDate);
  }
  if (isClosed) {
    assignment.isClosed = true;
  } else {
    assignment.isClosed = false;
  }
  const newAssignment = await assignment.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, newAssignment, "Assignment updated successfully")
    );
});

export const getAllAssignmentsBySubjectAndBatch = TryCatch(
  async (req, res, next) => {
    const { batch, subject } = req.body;
    if (!batch || !subject) {
      throw new ApiError(400, "Assignment ID is required");
    }
    const assignments = await Assignment.find({
      batch,
      subject,
    });
    if (!assignments) {
      throw new ApiError(404, "Assignment not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, assignments, "Assignment fetched"));
  }
);

export const submitAssignmentByStudent = TryCatch(async (req, res, next) => {
  const { assignment, student } = req.body;

  const files = req.files as unknown as any;
  if (!files) {
    throw new ApiError(400, "No files provided");
  }

  if (!assignment || !student) {
    throw new ApiError(400, "Assignment ID or Student ID is required");
  }

  const isAssignmentExist = await Assignment.findById(assignment).populate(
    "subject"
  );

  if (!isAssignmentExist) {
    throw new ApiError(404, "Assignment not found");
  }
  if (isAssignmentExist.isClosed) {
    throw new ApiError(400, "Assignment is closed");
  }
  const isStudentExist = await StudentAcademicDetails.findById(
    student
  ).populate("batch");
  if (!isStudentExist) {
    throw new ApiError(404, "Student not found");
  }
  if (
    isStudentExist.batch._id.toString() !=
    isAssignmentExist.batch._id.toString()
  ) {
    throw new ApiError(400, "Student does not belong to the same batch");
  }
  const submittedAssignment = await StudentAssignment.findOne({
    assignment: assignment,
    student: student,
  });
  if (submittedAssignment) {
    throw new ApiError(400, "Assignment already submitted");
  }

  const assignmentUrl: string[] = [];

  for (const file of files) {
    const uploadedFile = await uploadOnCloudinary(file.path);
    if (!uploadedFile) {
      throw new ApiError(500, "Failed to upload file");
    }
    assignmentUrl.push(uploadedFile.url);
  }

  const newStudentAssignment = await StudentAssignment.create({
    assignment: assignment,
    student: student,
    url: assignmentUrl,
  });

  res
    .status(200)
    .json(new ApiResponse(200, newStudentAssignment, "Assignment Submit"));
});

export const getAllSubmittedAssignmentsByStudent = TryCatch(
  async (req, res, next) => {
    const { assignment } = req.params;
    if (!assignment) {
      throw new ApiError(400, "Assignment ID is required");
    }
    const isAssignmentExist = await Assignment.findById(assignment);
    if (!isAssignmentExist) {
      throw new ApiError(404, "Assignment not found");
    }
    const submittedAssignments = await StudentAssignment.find({
      assignment: assignment,
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, submittedAssignments, "All submitted assignments")
      );
  }
);

export const readAssignmentAndGiveMarksComplete = TryCatch(
  async (req, res, next) => {
    const { studentAssignmentId } = req.params;
    const { marks } = req.body;
    if (!studentAssignmentId) {
      throw new ApiError(400, "Assignment ID and Student ID are required");
    }
    const studentAssignment = await StudentAssignment.findById(
      studentAssignmentId
    );
    if (!studentAssignment) {
      throw new ApiError(404, "Student Assignment not found");
    }
    studentAssignment.marks = marks;
    studentAssignment.read = true;
    res
      .status(200)
      .json(
        new ApiResponse(200, studentAssignment, "Assignment Marks Complete")
      );
  }
);

export const removeAttachmentsByStudents = TryCatch(async (req, res, next) => {
  const { studentAssignmentId } = req.params;
  const assignment = (await StudentAssignment.findById(studentAssignmentId)
    .populate("assignment")
    .exec()) as any;
  if (!assignment) {
    throw new ApiError(404, "Student Assignment not found");
  }
  if (assignment.assignment.isClosed) {
    throw new ApiError(400, "Assignment is closed");
  }
  assignment.url = [];
  const newAssignment = await assignment.save();
  res
    .status(200)
    .json(new ApiResponse(200, newAssignment, "Attachments removed"));
});
