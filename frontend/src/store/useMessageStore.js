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

  // USAGE: Get all messages after selecting a conversation
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

  // USAGE: send a message from message input component
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
      const newMessage = res.data;
      // Add new sent message to messages list
      set({ messages: [...messages, newMessage] });

      // Update front-end data (convosInfo sequence)
      useConversationStore
        .getState()
        .updateConvosInfoWithNewMessage(newMessage);

      // Update front-end data (selectedConversation sequence)
      useConversationStore
        .getState()
        .updateSelectedConversationWithNewMessage(newMessage);
    } catch (error) {
      console.log("Error in sendMessage: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Set socket client to listen to "newMessage" event from
  // socket server in navbar component for auth user
  subscribeToMessages: () => {
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
        .updateConvosInfoWithNewMessage(newMessage);

      // Update front-end data (selectedConversation sequence)
      useConversationStore
        .getState()
        .updateSelectedConversationWithNewMessage(newMessage);

      // Update front-end for read dot map (convoIdtoUnreadMap)
      // If the incoming new message is not sent from current selected conversation
      // or no conversation selected yet, update unreadMessagesNumberMap
      if (newMessage.conversationId !== selectedConversation?._id) {
        // Set unread badge in home icon
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

  // USAGE: Unsubscribe from "newMessage" event when navbar component destroyed
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
