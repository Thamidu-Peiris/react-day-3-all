import api from "./api"


export const getBranches_API = async () => {
    try {
        const response = await api.get("/branch")
        return response
    } catch (error) {
        console.log("Error while get branches :", error)
        return error.response   
    }
}

export const getBranch_API = async (id) => {
    try {
        const response = await api.get(`/branch/${id}`)
        return response
    } catch (error) {
        console.log("Error while get branch :", error)
        return error.response   
    }
}

export const createBranches_API = async (data) => {
    try {
        const response = await api.post("/branch", data)
        return response
    } catch (error) {
        console.log("Error while create branches :", error)
        return error.response      
    }
}

export const editBranches_API = async (id, data) => {
    try {
        const response = await api.put(`/branch/${id}`, data)
        return response
    } catch (error) {
        console.log("Error while edit branches :", error)
        return error.response       
    }
}



export const deleteBranches_API = async (id) => {
    try {
        const response = await api.delete(`/branch/${id}`)
        return response
    } catch (error) {
        console.log("Error while delete branches :", error)
        return error.response      
    }
}


