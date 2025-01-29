import { Types } from "mongoose";
import { ApiError } from "../utils/api.error.js";
import { Admin } from "../models/admins.model.js";

export const generateAccessAndRefreshTokens = async (_id: Types.ObjectId) => {
  try {
    const admin = await Admin.findById(_id);
    if (!admin) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = admin.generateAccessToken();

    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};
