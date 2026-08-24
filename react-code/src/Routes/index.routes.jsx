import React from "react";
import { Routes, Route } from "react-router";
import Students from "../page/Student/Students";
import StudentProfileView from "../page/Student/StudentProfileView";
import Branch from "../page/Branch/Branch";
import BranchView from "../page/Branch/BranchView";
import Login from "../page/Login";

const IndexRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='login' element={<Login/>} />
                <Route path='students' element={<Students/>} />
                <Route path='student/:s_id' element={<StudentProfileView/>} />
                <Route path='branches' element={<Branch/>} />
                <Route path='branch/:b_id' element={<BranchView/>} />
                <Route path='*' element={<div>Not Found</div>}/>
            </Routes>
        </div>
    );
}

export default IndexRoute