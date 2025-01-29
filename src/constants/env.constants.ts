import dotenv from "dotenv";
dotenv.config();

//environment variables
export const port: number = Number(process.env.PORT) || 3000;
export const mongoUri: string = process.env.MONGO_URI || "";
export const mongoDbName: string =
  process.env.MONGO_DB_NAME || "college-management-system-gcelt";
export const jwtSecret: string = process.env.JWT_SECRET || "";

export const superAdminUsername: string =
  process.env.SUPER_ADMIN_USERNAME || "";
export const superAdminPassword: string =
  process.env.SUPER_ADMIN_PASSWORD || "";

export const cloudinarySecret: string = process.env.CLOUDINARY_SECRET || "";
export const cloudinaryKey: string = process.env.CLOUDINARY_KEY || "";
export const cloudinaryName: string = process.env.CLOUDINARY_NAME || "";
export const cloudinaryUrl: string = process.env.CLOUDINARY_URL || "";

export const crossOrigin: string =
  process.env.CROSS_ORIGIN || "http://localhost:3000";
