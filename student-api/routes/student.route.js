import express from "express";
import { CreateStudent, DeleteStudent, EditStudent, GetStudents } from "../controller/student.controller.js";
import createStudentSchema from "../middlewares/validation/createstudent.schema.js";
import deleteStudentSchema from "../middlewares/validation/deletestudent.schema.js";
import editStudentSchema from "../middlewares/validation/editstudent.schema.js";
import { validate, validateParams } from "../middlewares/validation/validation.schema.js";

const StudentRoute = express.Router();

StudentRoute.get("/", GetStudents);
StudentRoute.post("/", validate(createStudentSchema), CreateStudent);
StudentRoute.put("/:id", validate(editStudentSchema), EditStudent);
StudentRoute.delete("/:id", validateParams(deleteStudentSchema), DeleteStudent);

export default StudentRoute
