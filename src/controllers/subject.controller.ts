import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../utils/custom.try-catch.block.js";
import { ApiError } from "../utils/api.error.js";
import { Subject } from "../models/subjects.model.js";
import { ApiResponse } from "../utils/api.response.js";
import { User } from "../models/users.model.js";

export const postSubject = TryCatch(
  async (
    req: Request<
      {},
      {},
      {
        subjectCode: string;
        subjectName: string;
        department: "CSE" | "IT" | "LT";
        semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
        type: "Theory" | "Practical";
        credit: number;
      }
    >,
    res: Response,
    _: NextFunction
  ) => {
    const { subjectCode, subjectName, department, semester, type, credit } =
      req.body;
    if (
      !(subjectCode && subjectName && department && semester && type && credit)
    ) {
      throw new ApiError(400, "Please provide all required fields");
    }
    const isSubjectExist = await Subject.findOne({ subjectCode });
    if (isSubjectExist) {
      throw new ApiError(400, "SubjectCode already exist");
    }
    const subject = await Subject.create({
      subjectCode,
      subjectName,
      department,
      semester,
      type,
      credit,
    });
    const createdSubject = await subject.save();
    res
      .status(201)
      .json(
        new ApiResponse(201, createdSubject, "Subject created successfully")
      );
  }
);

export const getSubject = TryCatch(async (_, res, __) => {
  const subjects = await Subject.find({})
    .sort({
      semester: 1,
      credit: -1,
    })
    .populate(["teacher"])
    .exec();
  res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
});

export const getSubjectsBySemesterAndDepartment = TryCatch(
  async (req, res, _) => {
    const { semester, department } = req.query;
    if (!semester || !department || !semester.length || department.length) {
      throw new ApiError(400, "Invalid semester or department");
    }
    const subjects = await Subject.find({ department, semester })
      .sort({
        semester: 1,
        credit: -1,
      })
      .populate(["teacher"]);
    res
      .status(200)
      .json(new ApiResponse(200, subjects, "Subjects fetched successfully"));
  }
);

export const updateSubject = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const { subjectCode, subjectName, department, semester, type, credit } =
    req.body;

  if (!_id) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const subject = await Subject.findById(_id);
  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  if (subjectCode && subject.subjectCode !== subjectCode) {
    subject.subjectCode = subjectCode;
  }
  if (subjectName && subject.subjectName !== subjectName) {
    subject.subjectName = subjectName;
  }
  if (department && subject.department !== department) {
    subject.department = department;
  }
  if (semester && subject.semester !== semester) {
    subject.semester = semester;
  }
  if (type && subject.type !== type) {
    subject.type = type;
  }
  if (credit && subject.credit !== credit) {
    subject.credit = credit;
  }
  const newSubject = await subject.save();

  res
    .status(200)
    .json(new ApiResponse(200, newSubject, "Subject updated successfully"));
});

export const deleteSubject = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const subject = await Subject.findByIdAndDelete(_id);

  if (!subject) {
    throw new ApiError(400, "Subject not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject deleted successfully"));
});

export const addTeacherToSubject = TryCatch(async (req, res, _) => {
  const { _id } = req.params;

  const { teacher } = req.body;
  if (!teacher) {
    throw new ApiError(401, "Teacher ID is required");
  }
  const subject = await Subject.findById(_id);

  if (!subject || subject.teacher === teacher) {
    throw new ApiError(
      400,
      "Subject not found or This Teacher already added to the subjects"
    );
  }
  const teacherExists = await User.findOne({
    _id: teacher,
    role: "teacher",
  });

  if (!teacherExists) {
    throw new ApiError(404, "Teacher not found");
  }
  subject.teacher = teacher;
  const newSubject = await subject.save();
  res
    .status(200)
    .json(
      new ApiResponse(200, newSubject, "Teacher added to subject successfully")
    );
});

export const removeTeacherFromSubject = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const subject = await Subject.findById(_id);
  if (!subject || !subject.teacher) {
    throw new ApiError(
      404,
      "Subject not found or Teacher not added to subject "
    );
  }
  subject.teacher = undefined;
  const newSubject = await subject.save();
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newSubject,
        "Teacher removed from subject successfully"
      )
    );
});
