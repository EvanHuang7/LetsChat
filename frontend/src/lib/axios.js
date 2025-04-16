import axios from "axios"

// axios is JS library that helps you make HTTP 
// requests from your code
export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    // It will make client to send cookie in the api request 
    // when calling any endpoints in this server
    withCredentials: true,
})