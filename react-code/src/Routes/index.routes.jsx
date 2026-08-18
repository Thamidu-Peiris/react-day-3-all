import React from "react";
import { Routes, Route } from "react-router";
import Students from "../page/Student/Students";

const IndexRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='students' element={<Students/>} />
                <Route path='*' element={<div>Not Found</div>}/>
                <Route path='attendance'/>
            </Routes>
        </div>
    );
}

export default IndexRoute