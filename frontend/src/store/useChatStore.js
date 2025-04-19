import { create } from "zustand"
import toast from "react-hot-toast"

import { axiosInstance } from "../lib/axios.js"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useChatStore = create((set) =>({
    users: [],
    selectedUser: null,
    messages: [],

    isUsersLoading: false,
    isMessagesLoading: false,

    // Function to make HTTP call to "api/message/users" endpoint
    getUsers: async() => {
        try {
            set({isUsersLoading: true})
            // Call the get users endpoint
            const res = await axiosInstance.get("/message/users")
            set({users: res.data})
        } catch (error) {
            console.log("Error in getUsers: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading: false})
        }
    },

    // Function to make HTTP call to "api/message/:id" endpoint
    getMessages: async(userId) => {
        try {
            set({isMessagesLoading: true})
            // Call the get message endpoint
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages: res.data})
        } catch (error) {
            console.log("Error in getMessages: ", error)
            toast.error(error.response.data.message)
        } finally {
            set({isMessagesLoading: false})
        }
    },
    //TODO: optimize this one latter
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },


}))

