import { model, Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/models.js";
import { ApiError } from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../constants/env.constants.js";
import { StudentAcademicDetails } from "./studentAcademicDetails.model.js";
import { Batch } from "./batches.model.js";
import { Result } from "./results.model.js";

const UserSchema = new Schema<IUser>(
  {
    userId: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: (value: number) => value.toString().length === 11,
        message: "User ID must be 11 characters long",
      },
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["student", "teacher"],
        message: "Role must be one of the following: student, teacher",
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be one of the following: male, female, other",
      },
    },
    gmail: {
      type: String,
      required: [true, "Gmail is required"],
      unique: true,
      validate: {
        validator: (value: string) =>
          value.includes(" ") || value.endsWith("@gmail.com"),
        message: "Invalid Gmail format",
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    mobileNumber: {
      type: Number,
      required: true,
      unique: true,
      validate: {
        validator: (value: number) => value.toString().length === 10,
        message: "Invalid mobile number format",
      },
    },
    avatarUrl: {
      type: String,
      default: "https://www.gravatar.com/avatar?d=identicon&s=200",
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        message: "Invalid blood group format",
      },
    },
    studentAcademicDetails: {
      type: String,
      ref: "StudentAcademicDetails",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//middleware hooks
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) next();
    if (!this.isNew && this.password.length < 8) {
      throw new ApiError(401, "Password must be at least 8 characters");
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    throw new ApiError();
  }
});

UserSchema.pre("findOneAndDelete", async function () {
  try {
    const user = await this.model.findOne(this.getFilter());
    if (user && user.role === "student") {
      await StudentAcademicDetails.findByIdAndDelete(
        user.studentAcademicDetails
      );
      await Result.deleteMany({
        student: user.studentAcademicDetails,
      });
    }
    // else if()
  } catch (error) {
    throw new ApiError();
  }
});

//methods
UserSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      role: this.role,
      userId: this.userId,
      gmail: this.gmail,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

UserSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    {
      _id: this._id,
    },
    jwtSecret,
    {
      expiresIn: "28d",
    }
  );
  return refreshToken;
};

UserSchema.methods.comparePassword = async function (password: string) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (error) {
    throw new ApiError();
  }
};

UserSchema.methods.generatePassword = function (dateOfBirth: Date) {
  const password: string = `${
    new Date(dateOfBirth).getDate().toString().length === 1 ? "0" : ""
  }${new Date(dateOfBirth).getDate().toString()}${
    (new Date(dateOfBirth).getMonth() + 1).toString().length === 1 ? "0" : ""
  }${(new Date(dateOfBirth).getMonth() + 1).toString()}${new Date(
    dateOfBirth
  ).getFullYear()}`;

  return password;
};

UserSchema.methods.validateUniqueFields = async function () {
  try {
    if (this.isNew) {
      const existingUser = await User.findOne({
        $or: [
          {
            userId: this.userId,
          },
          {
            gmail: this.gmail,
          },
          {
            mobileNumber: this.mobileNumber,
          },
        ],
      });
      return existingUser ? false : true;
    }
    if (this.isModified("userId")) {
      const existingUser = await User.findOne({ userId: this.userId });
      if (existingUser) return false;
    }
    if (this.isModified("gmail")) {
      const existingUser = await User.findOne({ gmail: this.gmail });
      if (existingUser) return false;
    }
    if (this.isModified("mobileNumber")) {
      const existingUser = await User.findOne({
        mobileNumber: this.mobileNumber,
      });
      if (existingUser) return false;
    }
    return true;
  } catch (error) {
    throw new ApiError();
  }
};

UserSchema.methods.createStudentAcademicDetails = async function ({
  batch,
  department,
}: {
  batch: Types.ObjectId;
  department: "CSE" | "IT" | "LT";
}) {
  try {
    if (this.role !== "student") return;

    const isBatchExists = await Batch.findById(batch);

    if (!isBatchExists) throw new ApiError(404, "Batch does not exist");

    const newStudentAcademicDetails = new StudentAcademicDetails({
      student: this._id,
      batch,
      department,
    });

    this.studentAcademicDetails = newStudentAcademicDetails._id;

    await newStudentAcademicDetails.save();
    return;
  } catch (error) {
    throw new ApiError();
  }
};
export const User = model<IUser>("users", UserSchema);
