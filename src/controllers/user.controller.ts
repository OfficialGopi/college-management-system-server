import { Types } from "mongoose";
import { cookieOptions } from "../constants/cookie.constants.js";
import { generateAccessAndRefreshTokens } from "../helper/user.helper.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";
import { jwtSecret } from "../constants/env.constants.js";
import jwt from "jsonwebtoken";

const createUser = TryCatch(async (req, res, _) => {
  const {
    userId,
    name,
    role,
    bloodGroup,
    address,
    dateOfBirth,
    mobileNumber,
    gmail,
    gender,
    batch,
    department,
  } = req.body;

  if (
    !userId ||
    !gender ||
    !name ||
    !role ||
    !bloodGroup ||
    !address ||
    !dateOfBirth ||
    !mobileNumber ||
    !gmail
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (role === "teacher" && (batch || department)) {
    throw new ApiError(400, "Teacher cannot have student academic details");
  }

  if (role === "student" && (!batch || !department)) {
    throw new ApiError(400, "Student academic details are required");
  }

  const user = new User({
    userId,
    name,
    role,
    bloodGroup,
    address,
    dateOfBirth: new Date(
      `${new Date(dateOfBirth).toISOString()}`.split("T")[0]
    ),
    mobileNumber,
    gmail,
    gender,
  });

  const password = user.generatePassword(user.dateOfBirth);

  user.password = password;

  if (user.role === "student") {
    user.studentAcademicDetails = user._id;
  }

  const validated = await user.validateUniqueFields();
  if (!validated) {
    throw new ApiError(409, "Duplicate");
  }

  await user.createStudentAcademicDetails({
    batch,
    department,
  });

  const saved = await user.save();

  res.status(200).json(new ApiResponse(200, saved, "User saved successfully"));
});

const login = TryCatch(async (req, res, _) => {
  const { userId, password, role } = <
    {
      userId: Types.ObjectId;
      password: string;
      role: "student" | "teacher";
    }
  >req.body;

  if (!userId || !password || !role) {
    throw new ApiError(401, "All fields are required");
  }

  const user = await User.findOne({ userId, role }).select(["password"]);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id)
    .select(["-password", "-refreshToken"])
    .populate("studentAcademicDetails")
    .exec();
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshAccessToken,
          user: loggedInUser,
        },
        "Logged in successfully"
      )
    );
});

//

const logout = TryCatch(async (req, res, _) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = TryCatch(async (req, res, _) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = <
      {
        _id: Types.ObjectId;
      }
    >jwt.verify(incomingRefreshToken, jwtSecret);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

const updateUser = TryCatch(async (req, res, _) => {
  const { _id } = req.params;
  const {
    userId,
    name,
    address,
    bloodGroup,
    dateOfBirth,
    mobileNumber,
    gmail,
    gender,
  } = req.body;
  const files = req.files as any[];
  //add avatar link
  const user = await User.findById(_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (userId && user.userId != userId) {
    user.userId = userId;
  }
  if (name && user.name != name) {
    user.name = name;
  }
  if (address && user.address != address) {
    user.address = address;
  }
  if (bloodGroup && user.bloodGroup != bloodGroup) {
    user.bloodGroup = bloodGroup;
  }
  if (dateOfBirth && user.dateOfBirth != dateOfBirth) {
    user.dateOfBirth = dateOfBirth;
  }
  if (mobileNumber && user.mobileNumber != mobileNumber) {
    user.mobileNumber = mobileNumber;
  }
  if (gmail && user.gmail != gmail) {
    user.gmail = gmail;
  }

  if (gender && user.gender != gender) {
    user.gender = gender;
  }
  const validated = await user.validateUniqueFields();
  if (!validated) {
    throw new ApiError(409, "Duplicate");
  }
  const newUserData = await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, newUserData, "User updated successfully"));
});

const deleteUser = TryCatch(async (req, res, _) => {
  const { _id } = req.body;

  if (!_id) {
    throw new ApiError(401, "Please provide all required fields");
  }

  const user = await User.findByIdAndDelete(_id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

const getAllTeachers = TryCatch(async (req, res, _) => {
  const teachers = await User.find({
    role: "teacher",
  });
  res.json(new ApiResponse(200, teachers, "All teachers fetched successfully"));
});

export {
  createUser,
  login,
  logout,
  refreshAccessToken,
  updateUser,
  deleteUser,
  getAllTeachers,
};
