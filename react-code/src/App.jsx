import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/LeftBar";
import IndexRoute from "./Routes/index.routes";

export default function App() {

  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const isLogin = location.pathname == "/login"


  return (
    <div className="flex">
        {!isLogin && (
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        )}

        <div className="flex-1">
        <IndexRoute/>
        </div>


    </div>
  )
}



