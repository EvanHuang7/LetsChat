import { create } from "zustand"
import toast from "react-hot-toast"

import { axiosInstance } from "../lib/axios.js"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useAuthStore = create((set) =>({
    // Intialize needed variables
    authUser: null,
    // Flags variables to control different spinners
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    // Function to make HTTP call to "api/auth/check" endpoint
    checkAuth: async() => {
        try {
            // Call the auth check endpoint
            const res = await axiosInstance.get("/auth/check")

            set({authUser: res.data})
        } catch (error) {
            console.log("Error in checkAuth: ", error)
            // When api call returns errors, that means 
            // user is not authenticated
            set({authUser: null})
        } finally {
            set({isCheckingAuth: false})
        }
    },

    // Function to make HTTP call to "api/auth/signup" endpoint
    signup: async(data) => {
        try {
            set({isSigningUp: true})
            // Call the signup endpoint
            const res = await axiosInstance.post("/auth/signup", data)
            set({authUser: res.data})

            toast.success("Signed up sucessfully")
        } catch (error) {
            console.log("Error in signup: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp: false})
        }
    },

    // Function to make HTTP call to "api/auth/login" endpoint
    login: async(data) => {
        try {
            set({isLoggingIn: true})
            // Call the login endpoint
            const res = await axiosInstance.post("/auth/login", data)
            set({authUser: res.data})

            toast.success("Logged in sucessfully")
        } catch (error) {
            console.log("Error in login: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn: false})
        }
    },

    // Function to make HTTP call to "api/auth/logout" endpoint
    logout: async() => {
        try {
            // Call the logout endpoint
            await axiosInstance.post("/auth/logout")
            set({authUser: null})

            toast.success("Logged out sucessfully")
        } catch (error) {
            console.log("Error in logout: ", error)
            toast.error(error.response.data.message)
        } 
    },

    // Function to make HTTP call to "api/auth/update-profile" endpoint
    updateProfile: async(data) => {
        try {
            set({isUpdatingProfile: true})
            // Call the update-profile endpoint
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({authUser: res.data})

            toast.success("Updated profile sucessfully")
        } catch (error) {
            console.log("Error in updateProfile: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isUpdatingProfile: false})
        }
    },

}))