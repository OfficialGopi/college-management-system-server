import { Schema, model } from "mongoose";
import { IAdmin } from "../types/models.js";
import { jwtSecret } from "../constants/env.constants.js";
import jwt from "jsonwebtoken";
const AdminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dko5qxqqi/image/upload/v1733977172/CMS/avatar/admin.jpg",
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    attendancesDepartment: {
      type: Boolean,
      default: false,
    },
    batchesDepartment: {
      type: Boolean,
      default: false,
    },
    noticesDepartment: {
      type: Boolean,
      default: false,
    },
    resultsDepartment: {
      type: Boolean,
      default: false,
    },
    routinesDepartment: {
      type: Boolean,
      default: false,
    },
    subjectsDepartment: {
      type: Boolean,
      default: false,
    },
    usersDepartment: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
AdminSchema.methods.generateAccessToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      adminId: this.adminId,
      gmail: this.gmail,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    }
  );
  return accessToken;
};

AdminSchema.methods.generateRefreshToken = function () {
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
export const Admin = model<IAdmin>("admins", AdminSchema);
