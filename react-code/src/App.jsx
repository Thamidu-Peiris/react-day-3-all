import { useState } from "react";
import Sidebar from "./components/LeftBar";
import Students from "./page/Student/Students";
import IndexRoute from "./Routes/index.routes";

export default function App() {

  const [collapsed, setCollapsed] = useState(false)



  return (
    <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1">
        <IndexRoute/>
        </div>


    </div>
  )
}
