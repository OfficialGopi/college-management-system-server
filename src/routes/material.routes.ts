import { Router } from "express";
import {
  deleteMaterial,
  getMaterials,
  uploadMaterial,
} from "../controllers/material.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const material = Router();

material.post("/", upload.array("materials"), uploadMaterial);
material.post("/get", getMaterials);
material.delete("/", deleteMaterial);

export { material };
