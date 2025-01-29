import { Request } from "express";
import { jwtSecret } from "../constants/env.constants.js";
import { User } from "../models/users.model.js";
import { ApiError } from "../utils/api.error.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";
import jwt from "jsonwebtoken";

const verifyJWT = TryCatch(async (req: Request, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = <
      {
        _id: string;
      }
    >jwt.verify(token, jwtSecret);

    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken")
      .populate("studentAcademicDetails");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid access token");
  }
});

export { verifyJWT };
