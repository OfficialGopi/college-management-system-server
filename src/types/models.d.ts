import { NextFunction } from "express";
import { Document, Types } from "mongoose";

//User
export interface IUser extends Document {
  _id: Types.ObjectId;
  userId: number;
  role: "student" | "teacher";
  password: string;
  name: string;
  address: string;
  gmail: string;
  mobileNumber: number;
  avatarUrl: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateOfBirth: Date;
  gender: "male" | "female" | "others";
  studentAcademicDetails?: Types.ObjectId;
  refreshToken?: string;

  createdAt: Date;
  updatedAt: Date;

  validateUniqueFields: () => Promise<boolean>;
  createStudentAcademicDetails: (studentAcademicDetails: {
    batch: Types.ObjectId;
    department: "CSE" | "IT" | "LT";
  }) => Promise<void>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  comparePassword: (password: string) => Promise<boolean>;
  generatePassword: (dateOfBirth: Date) => string;
}

export interface IStudentAcademicDetails extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  batch: Types.ObjectId;
  department: "CSE" | "IT" | "LT";
  status: "Studying" | "Graduated" | "Left";

  createdAt: Date;
  updatedAt: Date;
}

//Batch
export interface IBatch extends Document {
  _id: Types.ObjectId;
  isCompleted: boolean;
  completedSemester: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  startingYear: Date;

  createdAt: Date;
  updatedAt: Date;

  validateStartingYear: () => Promise<boolean>;
}

//Subject
export interface ISubject extends Document {
  _id: Types.ObjectId;
  subjectCode: string;
  subjectName: string;
  department: "CSE" | "IT" | "LT";
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  credit: number;
  type: "Theory" | "Practical";
  teacher?: string;
  subjectRunning: boolean;

  createdAt: Date;
  updatedAt: Date;
}

//Routine
export interface IRoutine extends Document {
  _id: Types.ObjectId;
  batch: Types.ObjectId;
  subject: Types.ObjectId;
  day: 1 | 2 | 3 | 4 | 5 | 6;
  shift: 1 | 2 | 3 | 4;

  createdAt: Date;
  updatedAt: Date;
}

//Result
export interface IResult extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  subject: Types.ObjectId;
  saved: boolean;
  pointsAchieved: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 7 | 8 | 9 | 10;
  grade: "O" | "E" | "A" | "B" | "C" | "D" | "F";

  createdAt: Date;
  updatedAt: Date;
}

//Notice
export interface INotice extends Document {
  _id: Types.ObjectId;

  title: string;
  details: string;
  attachments?: string[];
  date: Date;

  createdAt: Date;
  updatedAt: Date;
}

//Material
export interface IMaterial extends Document {
  batch: Types.ObjectId;
  subject: Types.ObjectId;
  title: string;
  description: string;
  materialUrl: string;

  createdAt: Date;
  updatedAt: Date;
}

//Attendence
export interface IStudentAttendance extends Document {
  _id: Types.ObjectId;
  attendence: Types.ObjectId;
  student: Types.ObjectId;
  isPresent: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface IAttendance extends Document {
  batch: Types.ObjectId;
  teacher: Types.ObjectId;
  subject: Types.ObjectId;
  date: Date;
  isAttendencePortalClose: boolean;

  createdAt: Date;
  updatedAt: Date;
}

//Assignment
export interface IStudentAssignment extends Document {
  _id: Types.ObjectId;
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  url: string[];
  submitted: boolean;
  read: boolean;
  marks: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IAssignment extends Document {
  batch: Types.ObjectId;
  subject: Types.ObjectId;
  title: string;
  description: string;
  dueDate?: Date;
  multiple: boolean;
  isClosed: boolean;

  createdAt: Date;
  updatedAt: Date;
}

//Admin
export interface IAdmin extends Document {
  _id: Types.ObjectId;
  adminId: string;
  name: string;
  gmail: string;
  password: string;
  profilePicture?: string;
  isActive: boolean;
  assignmentsDepartment: boolean;
  batchesDepartment: boolean;
  subjectsDepartment: boolean;
  usersDepartment: boolean;
  attendancesDepartment: boolean;
  resultsDepartment: boolean;
  noticesDepartment: boolean;
  studentAcademicDetailsDepartment: boolean;
  materialsDepartment: boolean;
  routinesDepartment: boolean;

  refreshToken: string;

  createdAt: Date;
  updatedAt: Date;

  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}
