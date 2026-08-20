import express from "express";
import { CreateStudent, DeleteStudent, GetStudents, UpdateStudent } from "../controller/student.controller.js";
import validate, { validateParams } from "../middlewares/validation/validatation.schema.js";
import createStudentSchema from "../middlewares/validation/createstudent.schema.js";
import deleteStudentSchema from "../middlewares/validation/deletestudent.schema.js";
import editStudentSchema from "../middlewares/validation/editstudent.schema.js";


const StudentRoute = express.Router()

StudentRoute.post('/', validate(createStudentSchema), CreateStudent)
StudentRoute.get('/', GetStudents)
StudentRoute.get('/:id', GetStudents)
StudentRoute.put('/:id', validate(editStudentSchema), UpdateStudent)
StudentRoute.delete('/:id', validateParams(deleteStudentSchema), DeleteStudent)
export default StudentRoute
