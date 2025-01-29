import { Router } from "express";
import {
  adminLogin,
  adminLogout,
  createAdmin,
  deleteAdmin,
  getAllAdmins,
  updateAdmin,
  verifyAdmin,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/admin.verifyJWT.middleware.js";

const admin = Router();

admin.post("/", createAdmin);
admin.get("/verifyaccesstoken", verifyAdmin);
admin.post("/getalladmins", getAllAdmins);
admin.post("/login", adminLogin);
admin.put("/:_id", updateAdmin);
admin.patch("/", verifyJWT, adminLogout);
admin.delete("/:_id", deleteAdmin);

export { admin };
