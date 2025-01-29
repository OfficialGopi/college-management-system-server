import { Router } from "express";
import {
  createUser,
  deleteUser,
  login,
  logout,
  refreshAccessToken,
  updateUser,
  getAllTeachers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/user.verifyJWT.middleware.js";

const user = Router();

user.post("/", createUser);
user.post("/getallteachers", getAllTeachers);
user.post("/login", login);
user.put("/:_id", updateUser);
user.patch("/refresh-access-token", refreshAccessToken);
user.patch("/logout", verifyJWT, logout);
user.delete("/", deleteUser);

export { user };
