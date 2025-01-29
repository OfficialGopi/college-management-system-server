import { Router } from "express";
import { superAdminLogin } from "../controllers/super-admin.controller.js";

const superAdmin = Router();

superAdmin.post("/login", superAdminLogin);

export { superAdmin };
