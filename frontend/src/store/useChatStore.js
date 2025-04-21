import { create } from "zustand"
import toast from "react-hot-toast"

import { axiosInstance } from "../lib/axios.js"
import { useAuthStore } from "./useAuthStore"

// Zustand is a handy state management tool for 
// managing state in React apps
export const useChatStore = create((set, get) =>({
    users: [],
    // TODO: store it local storage for remembering the conversation
    selectedUser: null,
    messages: [],

    // The unreadMessagesNumberMap is a state variable, not a function 
    // because we're immediately invoking the function with (), 
    // and assigning the result (a Map) as the initial value.
    unreadMessagesNumberMap: (() => {
        // Try to get the value from local storage first, {userId: number}
        const stringifiedValue = localStorage.getItem("unread-messages-number")
        if (stringifiedValue) {
            const parsedValue = JSON.parse(stringifiedValue);
            // reconstruct the Map
            return new Map(parsedValue);
        }

        return new Map();
    })(),

    isUsersLoading: false,
    isMessagesLoading: false,

    // Function to make HTTP call to "api/message/users" endpoint
    getUsers: async() => {
        try {
            const {unreadMessagesNumberMap, initializeUnreadMessagesNumberMap} = get()
            
            set({isUsersLoading: true})
            // Call the get users endpoint
            const res = await axiosInstance.get("/message/users")
            
            // If no data in local storage, we intailze one and store it in local storage.
            // Best solution: create a Conversation (can also used for add new friend feature) 
            // model and store last message view time into the table for unread number
            // TODO: if it's not empty, but having less users
            if (unreadMessagesNumberMap.size === 0) {
                initializeUnreadMessagesNumberMap(res.data)
            }

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
        // Get a state from another store file in a store file 
        const socket = useAuthStore.getState().socket

        // Listen to "newMessage" event and update messages list
        // whenever receicing newMessage from socket io server
        socket.on("newMessage", (newMessage) => {
            // We need to put these state variables inside socket.on() to get the 
            // newest value of selectedUser and unreadMessagesNumberMap when a newMessage event triggered.
            // If we put them outside socket.on(), they will keep using the old value
            // from when subscribeToMessages() function is called
            const {selectedUser, unreadMessagesNumberMap, setUnreadMessagesNumberMap} = get()

            // If the incoming new message is not sent from current selected
            // or no user selected yet, update unreadMessagesNumberMap
            if (newMessage.senderId !== selectedUser?._id) {
                setUnreadMessagesNumberMap(newMessage.senderId, unreadMessagesNumberMap.get(newMessage.senderId) + 1)
                return;
            }
            
            // We will append this new incoming message to current 
            // messages list to display in current chat history window,
            // only if the new message sender is current select user
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

        // If select a user, clear unread messages number for this user.
        // If close a chat window and set select user to null, do nothing.
        if (selectedUser) {
            const {setUnreadMessagesNumberMap} = get()
            setUnreadMessagesNumberMap(selectedUser._id, 0)
        }
    },

    initializeUnreadMessagesNumberMap: (users) => {
        const newMap = new Map();
        users.forEach(user => {
            newMap.set(user._id, 0)
        })
        set({ unreadMessagesNumberMap: newMap })
        // Need to convert the map to a serializable format because
        // localStorage only supports strings
        localStorage.setItem("unread-messages-number", JSON.stringify([...newMap]))
    },

    setUnreadMessagesNumberMap: (userId, value) => {
        // Zustand does shallow equality check: if the object reference hasn’t changed, it thinks "nothing changed".
        // So, We need to create a new map and update the state variable point to
        // a new reference because mutating state directly or mutating the 
        // same object won't detect any change and doesn’t trigger re-renders.
        const prevMap = get().unreadMessagesNumberMap;
        const newMap = new Map(prevMap); // clone to trigger reactivity
        newMap.set(userId, value);
        set({ unreadMessagesNumberMap: newMap });

        localStorage.setItem("unread-messages-number", JSON.stringify([...newMap]))
    },
}))

