import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { crossOrigin, port } from "./constants/env.constants.js";
import { mongoConnect } from "./utils/mongo.connect.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

//connecting database
mongoConnect();

//create express server
const app = express();

//express middleware
app.use(
  cors({
    origin: [crossOrigin],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//import routes
import { admin } from "./routes/admin.routes.js";
import { assignment } from "./routes/assignment.routes.js";
import { batch } from "./routes/batch.routes.js";
import { attendance } from "./routes/attendance.routes.js";
import { material } from "./routes/material.routes.js";
import { notice } from "./routes/notice.routes.js";
import { others } from "./routes/others.routes.js";
import { result } from "./routes/result.routes.js";
import { routine } from "./routes/routine.routes.js";
import { studentAcademicDetails } from "./routes/studentAcademicDetails.routes.js";
import { subject } from "./routes/subject.routes.js";
import { user } from "./routes/user.routes.js";
import { superAdmin } from "./routes/super-admin.routes.js";

//routes
app.use("/api/v1/admin", admin);
app.use("/api/v1/assignment", assignment);
app.use("/api/v1/attendence", attendance);
app.use("/api/v1/batch", batch);
app.use("/api/v1/material", material);
app.use("/api/v1/notice", notice);
app.use("/api/v1/others", others);
app.use("/api/v1/result", result);
app.use("/api/v1/routine", routine);
app.use("/api/v1/studentacademicdetails", studentAcademicDetails);
app.use("/api/v1/subject", subject);
app.use("/api/v1/user", user);
app.use("/api/v1/super-admin", superAdmin);

//error-middleware
app.use(errorMiddleware);

//server listening
app.listen(port, () => console.log("Listening on port " + port));
