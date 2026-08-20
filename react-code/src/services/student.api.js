import api from "./api"


export const getStudents_API = async () => {
    try {
        const response = await api.get("/student")
        return response
    } catch (error) {
        console.log("Error while get students :", error)
        return error.response   
    }
}

export const getStudent_API = async (id) => {
    try {
        const response = await api.get(`/student/${id}`)
        return response
    } catch (error) {
        console.log("Error while get student :", error)
        return error.response   
    }
}

export const createStudents_API = async (data) => {
    try {
        const response = await api.post("/student", data)
        return response
    } catch (error) {
        console.log("Error while create students :", error)
        return error.response      
    }
}

export const editStudents_API = async (id, data) => {
    try {
        const response = await api.put(`/student/${id}`, data)
        return response
    } catch (error) {
        console.log("Error while edit students :", error)
        return error.response       
    }
}



export const deleteStudents_API = async (id) => {
    try {
        const response = await api.delete(`/student/${id}`)
        return response
    } catch (error) {
        console.log("Error while delete students :", error)
        return error.response      
    }
}


