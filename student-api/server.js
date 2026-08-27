import express from "express";
import AdminRoute from "./routes/admin.route.js";
import StudentRoute from "./routes/student.route.js";
import BranchRoute from "./routes/branch.route.js";
import cors from "cors"


const app = express ()

app.use(cors())
app.use(express.json())


app.use("/api/v1/student",StudentRoute)
app.use("/api/v1/branch", BranchRoute)
app.use("/api/v1/admin", AdminRoute)
app.get("/api/v1/students", StudentRoute)

app.listen(9000, ()=> (console.log('server is running')))