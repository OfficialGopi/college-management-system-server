import { Schema, model } from "mongoose";
import { IRoutine } from "../types/models.js";

const RoutineSchema = new Schema<IRoutine>(
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
    day: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6],
    },
    shift: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4],
    },
  },
  {
    timestamps: true,
  }
);

export const Routine = model<IRoutine>("routines", RoutineSchema);
