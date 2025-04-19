import { create } from "zustand"
import toast from "react-hot-toast"

import { axiosInstance } from "../lib/axios.js"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useChatStore = create((set, get) =>({
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

    // Function to make HTTP call to "api/message/send/:id" endpoint
    sendMessage: async(data) => {
        try {
            const {selectedUser, messages} = get()
            // Call the send message endpoint
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data)
            // Add new sent message to messages list
            set({messages: [...messages, res.data]})
        } catch (error) {
            console.log("Error in sendMessage: ", error)
            toast.error(error.response.data.message)
        } 
    },

    //TODO: optimize this one latter
    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
}))

