import express from "express";
import StudentRoute from "./routes/student.route.js";
import cors from "cors"

const app = express ()

app.use(cors())
app.use(express.json())


app.use("/student",StudentRoute)


app.listen(9000, ()=> (console.log('server is running')))