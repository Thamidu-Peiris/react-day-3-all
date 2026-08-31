import express from "express";
import StudentRoute from "./routes/student.route.js";
import BranchRoute from "./routes/branch.route.js";
import AdminRoute from "./routes/admin.route.js";
import cors from "cors"
import { ProtectRoute } from "./middlewares/ProtectRoute.js";
import cookieParser from "cookie-parser";

const app = express ()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,methods: ["GET","POST","PUT","DELETE","PATCH"]
}));





app.use("/api/v1/admin", AdminRoute)

app.use(ProtectRoute)
app.use("/api/v1/student",StudentRoute)
app.use("/api/v1/branch",BranchRoute)
app.get("/api/v1/students", StudentRoute)

app.listen(9000, ()=> (console.log('server is running')))