import { StudentAcademicDetails } from "../models/studentAcademicDetails.model.js";
import { ApiResponse } from "../utils/api.response.js";
import { TryCatch } from "../utils/custom.try-catch.block.js";

const getStudentsCountData = TryCatch(async (req, res, _) => {
  const students = await StudentAcademicDetails.find().populate("student");
  const male = students.filter(
    (student: any) => student.student.gender == "male"
  );
  const female = students.filter(
    (student: any) => student.student.gender == "female"
  );
  const others = students.filter(
    (student: any) => student.student.gender == "others"
  );
  res.status(200).json(
    new ApiResponse(200, {
      totalStudents: students.length,
      male,
      female,
      others,
    })
  );
});

export { getStudentsCountData };
