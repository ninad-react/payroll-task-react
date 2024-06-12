import axios from "axios";
import toast from "react-hot-toast";

const privateRequest = axios.create({
    // baseURL: process.env.REACT_APP_API_BASE_URL
})
 
const requestHandler = (request) => {
    const token = localStorage.getItem("token") ? localStorage.getItem("token"): ""
    request.headers.Authorization = `Basic ${token}`
    return request
}

const clearToken = () => {
    localStorage.removeItem("token")
}

const responseErrorHandler = (error) => {
    if(error.response){
        const {status, data, message} = error.response
        
        switch (status) {
            case 401:
                clearToken()
                window.location.href = "/"
                toast.warn("Token expired, please login")
                break;
            case 400:
                toast.error(data.message ? data.message : message || "Invalid Value/ Bad Request")
                break;
            case 403:
                toast.error(data.message ? data.message : message || "Access Denied/ Forbidden")
                break;
            case 404:
                toast.error(data.message ? data.message : message || "Item doesn't exist")
                break;
            case 405:
                toast.error(data.message ? data.message : message || "Invalid Request")
                break;
            case 422:
                toast.error(data.message ? data.message : message || "Already Exists")
                break;
            case 504:
                toast.error(data.message ? data.message : message || "Network Error")
                break;
            default:
                toast.error(data.message ? data.message : message || "Network Error")
                break;
        }
    }
    else{
        toast.error(error?.message || "Network Error")
    }
}

const errorHandler = (error) => {
    return Promise.reject(error)
}

privateRequest.interceptors.request.use(
    requestHandler,
    errorHandler
)

privateRequest.interceptors.response.use(
    response => response,
    responseErrorHandler
)

export const privateGet = (endPoint, queryParameters) => {
    return privateRequest.get(endPoint, {
        params: queryParameters
    })
}

export const privatePost = (endPoint, data) => {
    return privateRequest.post(endPoint, data)
}

export const privatePut = (endPoint, id, data) => {
    return privateRequest.put(`${endPoint}/${id}`, data)
}

export const privatePatch = (endPoint, id, data) => {
    return privateRequest.put(`${endPoint}/${id}`, data)
}

export const privateDelete = (endPoint, id) => {
    return privateRequest.delete(`${endPoint}/${id}`)
}

export default privateRequest