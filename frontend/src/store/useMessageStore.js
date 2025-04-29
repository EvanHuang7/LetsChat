import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { useConversationStore } from "./useConversationStore.js";

// Zustand is a handy state management tool for
// managing state in React apps
export const useMessageStore = create((set, get) => ({
  messages: [],
  isMessagesLoading: false,

  unreadNumInHomeIcon: 0,
  setUnreadNumInHomeIcon: (value) => set({ unreadNumInHomeIcon: value }),

  // Function to make HTTP call to "api/message/:id" endpoint
  getMessages: async (conversationId) => {
    try {
      set({ isMessagesLoading: true });
      // Call the get message endpoint
      const res = await axiosInstance.get(`/message/${conversationId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Function to make HTTP call to "api/message/send/:id" endpoint
  sendMessage: async (data) => {
    try {
      const selectedConversation =
        useConversationStore.getState().selectedConversation;
      const { messages } = get();

      // Call the send message endpoint
      const res = await axiosInstance.post(
        `/message/send/${selectedConversation._id}`,
        data
      );
      // Add new sent message to messages list
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in sendMessage: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Function to subscribe any new incoming messages from selected user
  // for auth user
  subscribeToMessages: () => {
    // Get a state from another store file in a store file
    const socket = useAuthStore.getState().socket;

    // Listen to "newMessage" event and update messages list
    // whenever receicing newMessage from socket io server
    socket.on("newMessage", (newMessage) => {
      // We need to put these state variables inside socket.on() to get the
      // newest value of these states when a newMessage event triggered.
      // If we put them outside socket.on(), they will keep using the old value
      // from when subscribeToMessages() function is called
      const convoIdtoUnreadMap =
        useConversationStore.getState().convoIdtoUnreadMap;
      const selectedConversation =
        useConversationStore.getState().selectedConversation;

      // Update front-end data (convosInfo sequence)
      useConversationStore
        .getState()
        .updateConvosInfoMessageSequence(newMessage);

      // Update front-end data (selectedConversation sequence)
      useConversationStore
        .getState()
        .updateSelectedConversationMessageSequence(newMessage);

      // Update front-end for read dot map (convoIdtoUnreadMap)
      // If the incoming new message is not sent from current selected conversation
      // or no conversation selected yet, update unreadMessagesNumberMap
      if (newMessage.conversationId !== selectedConversation?._id) {
        get().setUnreadNumInHomeIcon(get().unreadNumInHomeIcon + 1);

        useConversationStore
          .getState()
          .updateConvoIdtoUnreadMap(
            newMessage.conversationId,
            convoIdtoUnreadMap?.[newMessage.conversationId] + 1 || 1
          );
        return;
      }

      // We will append this new incoming message to current
      // messages list to display in current chat history window,
      // only if the new message sender is currented select conversation
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // Function to unsubscribe any new incoming messages for auth user
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
