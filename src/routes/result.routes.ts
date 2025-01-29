import { Router } from "express";
import {
  createResult,
  deleteResult,
} from "../controllers/result.controller.js";

const result = Router();
result.post("/", createResult);
result.post("/get/:student", deleteResult);
result.delete("/:result", deleteResult);
export { result };
