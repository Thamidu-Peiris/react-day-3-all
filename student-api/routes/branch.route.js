import express from "express";
import { CreateBranch, DeleteBranch, GetBranches, UpdateBranch } from "../controller/branch.controller.js";
import validate, { validateParams } from "../middlewares/validation/validatation.schema.js";
import createBranchSchema from "../middlewares/validation/createbranch.schema.js";
import deleteBranchSchema from "../middlewares/validation/deletebranch.schema.js";
import editBranchSchema from "../middlewares/validation/editbranch.schema.js";


const BranchRoute = express.Router()

BranchRoute.post('/', validate(createBranchSchema), CreateBranch)
BranchRoute.get('/', GetBranches)
BranchRoute.get('/:id', GetBranches)
BranchRoute.put('/:id', validate(editBranchSchema), UpdateBranch)
BranchRoute.delete('/:id', validateParams(deleteBranchSchema), DeleteBranch)
export default BranchRoute
