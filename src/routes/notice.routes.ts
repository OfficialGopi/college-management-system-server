import { Router } from "express";
import {
  createNotice,
  deleteNotices,
  getAllNoticesToday,
} from "../controllers/notice.controller.js";

const notice = Router();

notice.post("/", createNotice);
notice.post("/get", getAllNoticesToday);
notice.delete("/:notice", deleteNotices);

export { notice };
