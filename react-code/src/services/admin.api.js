import api from "./api"

export const adminLogin_API = async (data) => {
    try {
        const response = await api.post("/admin/login", data)
        return response
    } catch (error) {
        console.log("Error while admin login :", error)
        return error.response
    }
}