import {
  superAdminPassword,
  superAdminUsername,
} from "../constants/env.constants.js";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

export const superAdminLogin = TryCatch(async (req, res) => {
  const { superAdminId, password } = req.body;
  if (!superAdminId || !password) {
    throw new ApiError(401, "All fields must be provided");
  }
  if (superAdminId !== superAdminUsername && password !== superAdminPassword) {
    throw new ApiError(400, "Username and password must match");
  }
  res.status(200).json(new ApiResponse(200, "Login successful"));
});
