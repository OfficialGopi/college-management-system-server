import { Schema, model } from "mongoose";
import { INotice } from "../types/models.js";

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    date: {
      type: Date,
      default: new Date(new Date().toISOString().split("T")[0]),
    },
  },
  {
    timestamps: true,
  }
);

export const Notice = model<INotice>("notices", NoticeSchema);
