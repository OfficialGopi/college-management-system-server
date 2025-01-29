import { Router } from "express";
import {
  createBatch,
  getAllRunningBatches,
  increaseSemesterOrCloseBatchIfAllSemesterCompleted,
  updateBatchStartingYear,
  deleteBatchSecurely,
} from "../controllers/batch.controller.js";

const batch = Router();

batch.get("/", getAllRunningBatches);
batch.post("/", createBatch);
batch.put("/:_id", updateBatchStartingYear);
batch.patch("/:_id", increaseSemesterOrCloseBatchIfAllSemesterCompleted);
batch.delete("/:_id", deleteBatchSecurely);

export { batch };
