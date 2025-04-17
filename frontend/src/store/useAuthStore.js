import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useAuthStore = create((set) =>({
    // Intialize needed variables
    authUser: null,
    // Flags variables to control different spinners
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

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

    signup: async(data) => {
        try {
            
        } catch (error) {
            
        }
    }

}))