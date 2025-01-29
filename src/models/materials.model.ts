import { model, Schema } from "mongoose";
import { IMaterial } from "../types/models.js";

const MaterialSchema = new Schema<IMaterial>(
  {
    batch: {
      type: Schema.Types.ObjectId,
      ref: "batches",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "subjects",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    materialUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Material = model<IMaterial>("materials", MaterialSchema);
