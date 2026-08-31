import express from "express";
import { AdminLogin } from "../controller/adminlogin.controller.js";
import validate from "../middlewares/validation/validatation.schema.js";
import adminLoginSchema from "../middlewares/validation/adminlogin.schema.js";


const AdminRoute = express.Router();
AdminRoute.post("/login", validate(adminLoginSchema), AdminLogin);

AdminRoute.post("/refresh-token", (req, res) => {
    return res.json({
        message: "token refresh",
        cookie:req.cookies
    })
});



export default AdminRoute;
