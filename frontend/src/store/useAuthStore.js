import { create } from "zustand"
import toast from "react-hot-toast"
import { io } from 'socket.io-client'

import { axiosInstance } from "../lib/axios.js"

// Backend server base url
const BACK_END_BASE_URL = "http://localhost:5001"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useAuthStore = create((set, get) =>({
    // Intialize needed variables
    authUser: null,
    onlineUsers: [],
    socket: null,
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

            // Connect to socket io whenever refreshing the 
            // page (application starts) and auth granted
            get().connectSocket()
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

            // Connect to socket io when signed up sucessfully
            get().connectSocket()
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

            // Connect to socket io whenever logged in sucessfully
            get().connectSocket()
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

            // Disconnect to socket io whenever logged out sucessfully
            get().disconnectSocket()
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

    // Function to connect to socket io server
    connectSocket: () => {
        const {authUser} = get()
        // If user is not auth granted or already connected to socket,
        // do not connect to socket or connect again
        if (!authUser || get().socket?.connected) return;
        
        // Create socket io client and start connection to socket io server 
        // with passing a query including userId 
        const socket = io(BACK_END_BASE_URL, {
            query: {
                userId: authUser._id,
            },
        })
        socket.connect()

        // Set the const socket io client object to socket state
        set({socket: socket})

        // Set the socket io client to listen to the event
        // (any oneline users update) from socket io server
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    // Function to disconnect to socket io server
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
    },
}))