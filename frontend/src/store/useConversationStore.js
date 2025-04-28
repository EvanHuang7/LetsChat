import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { useConnectionStore } from "./useConnectionStore.js";

export const useConversationStore = create((set, get) => ({
  // This is an array containing multiple "convoInfoOfUser" object
  convoInfoOfUserList: [],
  isConvoInfoOfUserListLoading: false,

  selectedConversation: null,
  unreadMessagesNumberMap: null,

  // USAGE: Get all conversations info in sidebar for logged in user
  getConvoInfoOfUserList: async () => {
    try {
      set({ isConvoInfoOfUserListLoading: true });

      // Call the endpoint
      const res = await axiosInstance.get("/convoInfoOfUser/getAll");

      set({ convoInfoOfUserList: res.data });
    } catch (error) {
      console.log("Error in getConvoInfoOfUserList: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isConvoInfoOfUserListLoading: false });
    }
  },

  // Create a conversation when logged in user creates a group conversation
  createConversation: async (data) => {
    try {
      // Call endpoint
      const res = await axiosInstance.post("/conversation/create", data);

      // TODO: Build a fake convoInfoOfUser object with new created conversation
      // and add it  to convoInfoOfUserList

      // set({ conversations: [res.data, ...get().conversations] });
    } catch (error) {
      console.log("Error in createConversation: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Function to set a selected conversation
  setSelectedConversation: async (selectedConversation) => {
    set({ selectedConversation });

    // If select a conversation instead of closing a conversation,
    // clear unread messages number
    if (selectedConversation) {
      // Call endpoint
      await axiosInstance.post("/convoInfoOfUser/update", {
        conversationId: selectedConversation._id,
        lastReadMessageSequence: selectedConversation.latestSentMessageSequence,
      });

      // TODO: update this conversation unread in front-end real time
    }
  },
}));
