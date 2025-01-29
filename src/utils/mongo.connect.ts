import mongoose from "mongoose";
import { mongoDbName, mongoUri } from "../constants/env.constants.js";

export const mongoConnect = async () => {
  try {
    await mongoose.connect(mongoUri, {
      dbName: mongoDbName,
    });
    console.log("connected to mongo");
  } catch (error) {
    console.error("Error connecting to mongo", error);
  }
};
