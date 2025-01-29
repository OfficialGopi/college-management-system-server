import { cookieOptions } from "../constants/cookie.constants.js";
import { jwtSecret } from "../constants/env.constants.js";
import { generateAccessAndRefreshTokens } from "../helper/admin.helper.js";
import { Admin } from "../models/admins.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";
import jwt from "jsonwebtoken";

const adminLogin = TryCatch(async (req, res, next) => {
  const { adminId, password } = <
    {
      adminId: string;
      password: string;
    }
  >req.body;
  if (!adminId || !password) {
    throw new ApiError(401, "All fields must be provided");
  }
  const admin = await Admin.findOne({ adminId, password });

  if (!admin) {
    throw new ApiError(401, "Invalid admin credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id)
    .select(["-password", "-refreshToken"])
    .exec();

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken,
          accessToken,
          admin: loggedInAdmin,
        },
        "Admin Logged In Successfully"
      )
    );
});

const createAdmin = TryCatch(async (req, res, _) => {
  const { adminId, gmail, name, password } = req.body;

  if (!(adminId && name && password && gmail)) {
    throw new ApiError(400, "All fields are required");
  }

  const admin = new Admin({
    adminId,
    gmail,
    name,
    password,
  });

  const saved = await admin.save();

  res.status(200).json(new ApiResponse(200, saved, "Admin saved successfully"));
});

const adminLogout = TryCatch(async (req, res, _) => {
  if (!req.admin) {
    throw new ApiError(401, "User not authenticated");
  }
  await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const deleteAdmin = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const adminDeleted = await Admin.findByIdAndDelete(_id);
  if (!adminDeleted) {
    throw new ApiError(404, "Admin not found");
  }
  res.status(200).json(new ApiResponse(200, adminDeleted, "Admin deleted"));
});

//Avatar Url to add
const updateAdmin = TryCatch(async (req, res, next) => {
  const { _id } = req.params;
  const {
    adminId,
    gmail,
    name,
    password,
    attendancesDepartment,
    batchesDepartment,
    subjectsDepartment,
    usersDepartment,
    resultsDepartment,
    noticesDepartment,
    routinesDepartment,
  }: {
    adminId: string;
    name: string;
    password: string;
    gmail: string;
    attendancesDepartment?: boolean;
    batchesDepartment?: boolean;
    subjectsDepartment?: boolean;
    usersDepartment?: boolean;
    resultsDepartment?: boolean;
    noticesDepartment?: boolean;
    routinesDepartment?: boolean;
  } = req.body;
  const admin = await Admin.findById(_id);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }
  if (adminId && admin.adminId != adminId) {
    admin.adminId = adminId;
  }
  if (name && admin.name != name) {
    admin.name = name;
  }
  if (password && admin.password != password) {
    admin.password = password;
  }
  if (gmail && admin.gmail != gmail) {
    admin.gmail = gmail;
  }

  if (
    attendancesDepartment &&
    admin.attendancesDepartment != attendancesDepartment
  ) {
    admin.attendancesDepartment = attendancesDepartment;
  }
  if (batchesDepartment && admin.batchesDepartment != batchesDepartment) {
    admin.batchesDepartment = batchesDepartment;
  }
  if (subjectsDepartment && admin.subjectsDepartment != subjectsDepartment) {
    admin.subjectsDepartment = subjectsDepartment;
  }
  if (usersDepartment && admin.usersDepartment != usersDepartment) {
    admin.usersDepartment = usersDepartment;
  }
  if (resultsDepartment && admin.resultsDepartment != resultsDepartment) {
    admin.resultsDepartment = resultsDepartment;
  }
  if (noticesDepartment && admin.noticesDepartment != noticesDepartment) {
    admin.noticesDepartment = noticesDepartment;
  }
  if (routinesDepartment && admin.routinesDepartment != routinesDepartment) {
    admin.routinesDepartment = routinesDepartment;
  }
  const updatedAdmin = await admin.save();
  res
    .status(200)
    .json(new ApiResponse(200, updatedAdmin, "Admin updated successfully"));
});

const getAllAdmins = TryCatch(async (req, res, _) => {
  const admins = await Admin.find({});
  res
    .status(200)
    .json(new ApiResponse(200, admins, "Admins Fetched Successfully"));
});

const verifyAdmin = TryCatch(async (req, res, _) => {
  if (!req.cookies.accessToken) {
    res.status(400).json(new ApiError(401, "Unauthorized"));
  }
  const decoded: any = await jwt.verify(req.cookies.accessToken, jwtSecret);
  const admin = await Admin.findById(decoded._id).select([
    "-password",
    "-refreshToken",
  ]);
  res.status(200).json(new ApiResponse(200, admin, "successful"));
});

export {
  verifyAdmin,
  adminLogin,
  createAdmin,
  adminLogout,
  deleteAdmin,
  updateAdmin,
  getAllAdmins,
};
