import { useContext } from "react";
import { createContext } from "react";
import { useState } from "react";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {


        const accessToken = localStorage.getItem("accessToken")
        const userData = JSON.stringify(localStorage.getItem("user"))
        const isHave = accessToken && userData
        const [user, setuser] = useState(isHave ? userData : false)




    const Login = (accessToken, user) => {

        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("user", JSON.stringify(user))
        setuser(user)
        window.location.reload()

    }

    const Logout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
        setuser(false)
        window.location.reload(true)
    }


    return (
        <AuthContext.Provider value={{ user, Login, Logout }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuthContext = () => {
    return useContext(AuthContext)
}

