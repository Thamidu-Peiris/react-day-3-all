import React from "react";
import { Routes, Route } from "react-router";
import Students from "../page/Student/Students";
import StudentProfileView from "../page/Student/StudentProfileView";
import Branch from "../page/Branch/Branch";
import BranchView from "../page/Branch/BranchView";
import Login from "../page/Login";
import { useAuthContext } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const IndexRoute = () => {
    const { user } = useAuthContext()
    return (
        <div>
            <Routes>
                <Route path='login' element={user ? <Navigate to='/' /> : <Login />} />

                <Route element={user ? <Outlet />
                    : <Navigate to='/login' />}>

                    <Route path='/' element={<Students />} />

                    <Route path='students' element={<Students />} />
                    <Route path='student/:s_id' element={<StudentProfileView />} />
                    <Route path='branches' element={<Branch />} />
                    <Route path='branch/:b_id' element={<BranchView />} />
                    <Route path='*' element={<div>Not Found</div>} />

                </Route>

            </Routes>
        </div>
    );
}

export default IndexRoute