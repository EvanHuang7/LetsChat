import { create } from "zustand"
import toast from "react-hot-toast"

import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore"

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

    // Function to subscribe any new incoming messages from selected user
    // for auth user
    subscribeToMessages: () => {
        const {selectedUser} = get()
        if (!selectedUser) return

        // Get a state from another store file in a store file 
        const socket = useAuthStore.getState().socket

        // Listen to "newMessage" event and update messages list
        // whenever receicing newMessage from socket io server
        socket.on("newMessage", (newMessage) => {
            // If the incoming new message is not sent from current selected 
            // user, we will not append this new incoming message to current 
            // messages list to display in current chat history window
            if (newMessage.senderId !== selectedUser._id) return
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    // Function to unsubscribe any new incoming messages for auth user
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
}))

