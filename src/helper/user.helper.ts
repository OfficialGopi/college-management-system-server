import { Types } from "mongoose";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/api.error.js";

export const generateAccessAndRefreshTokens = async (_id: Types.ObjectId) => {
  try {
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};
