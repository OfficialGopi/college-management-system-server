import { Router } from "express";
import { getStudentsCountData } from "../controllers/others.controller.js";

const others = Router();

others.post("/getstudentscountdata", getStudentsCountData);

export { others };
