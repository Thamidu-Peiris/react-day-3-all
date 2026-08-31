import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials:true,
   
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
        config.headers["Authorization"] = `Bearer=${token}`
    }
    return config
}, (error) => {
    return Promise.reject(error)
}
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {

        if (error.response.status == 401 && error.response.data.code == "TOKEN_EXPIRED") {


            try {

                const res = axios.post(`${API_BASE_URL}/admin/refresh-token`,{},{withCredentials:true})


            } catch (error) {
                localStorage.removeItem("accessToken")
                localStorage.removeItem("user")
                window.location.reload(true)
            }

        } else if (error.response.status == 401 && error.response.data.Unauthorized) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("user")
            window.location.reload(true)
        }
        return Promise.reject.apply(error)


    }

)



export default api