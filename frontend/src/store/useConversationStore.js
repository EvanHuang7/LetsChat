import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

export const useConversationStore = create((set, get) => ({
  // This is an array of "convoInfoOfUser" object
  convosInfo: [],
  isConvosInfoLoading: false,

  selectedConversation: null,
  convoIdtoUnreadMap: null,

  setConvosInfo: (value) => set({ convosInfo: value }),

  // USAGE: Get all conversations info in sidebar for logged in user
  getConvosInfo: async () => {
    try {
      set({ isConvosInfoLoading: true });

      // Call the endpoint
      const res = await axiosInstance.get("/convoInfoOfUser/getAll");
      const convosInfo = res.data;

      // Set convosInfo
      set({ convosInfo: convosInfo });

      // Build convoIdtoUnreadMap
      get().buildConvoIdtoUnreadMap(convosInfo);
    } catch (error) {
      console.log("Error in getConvosInfo: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isConvosInfoLoading: false });
    }
  },

  // Create a conversation when logged in user creates a group conversation
  createConversation: async (data) => {
    try {
      // Call endpoint
      const res = await axiosInstance.post("/conversation/create", data);

      // TODO: Build a fake convoInfo object with new created conversation
      // and add it to convosInfo

      // set({ conversations: [res.data, ...get().conversations] });
    } catch (error) {
      console.log("Error in createConversation: ", error);
      toast.error(error.response.data.message);
    }
  },

  updateConvoInfoOfUser: async (conversation) => {
    try {
      // Call endpoint
      await axiosInstance.post("/convoInfoOfUser/update", {
        conversationId: conversation._id,
        lastReadMessageSequence: conversation.latestSentMessageSequence,
      });
    } catch (error) {
      console.log("Error in updateConvoInfoOfUser: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Function to set a selected conversation
  // Udpate back-end unread message numer data
  setSelectedConversation: async (selectedConversation) => {
    const previousConversation = get().selectedConversation;
    set({ selectedConversation });

    // Build userIdToInfoMap of selecting a conversation
    get().buildUserIdToInfoMap(selectedConversation);

    // If closing a conversation from X button or go to another page
    // or switching from previousConversation to another conversation.
    // clear unread message number for previousConversation
    if (previousConversation) {
      // Call endpoint to udpate back-end data
      await get().updateConvoInfoOfUser(previousConversation);
    }

    // If selecting a conversation from null or from previous conversation,
    // clear unread message number for current selected conversation
    // and clear previous conversation unread message num in next If state
    if (selectedConversation) {
      // Call endpoint to udpate back-end data
      await get().updateConvoInfoOfUser(selectedConversation);

      // Reset this conversation unread num in front-end to 0
      get().updateConvoIdtoUnreadMap(selectedConversation._id, 0);
    }
  },

  // Build convoIdtoUnreadMap for all convosInfo
  buildConvoIdtoUnreadMap: (convosInfo) => {
    if (convosInfo) {
      const convoIdtoUnreadMap = {};
      convosInfo.forEach((convoInfo) => {
        convoIdtoUnreadMap[convoInfo.conversationId._id] =
          convoInfo.conversationId.latestSentMessageSequence -
          convoInfo.lastReadMessageSequence;
      });
      // Set convoIdtoUnreadMap
      set({ convoIdtoUnreadMap: convoIdtoUnreadMap });
    }
  },

  // Build userIdToInfoMap for a selected conversation
  buildUserIdToInfoMap: (selectedConversation) => {
    if (selectedConversation) {
      const userIdToInfoMap = {};
      selectedConversation.userIds.forEach((user) => {
        userIdToInfoMap[user._id] = {
          _id: user._id,
          fullName: user.fullName,
          profilePic: user.profilePic,
        };
      });

      selectedConversation.userIdToInfoMap = userIdToInfoMap;
    }
  },

  // TODO: call it when sending a new message
  // Update front-end unread message numer data (selectedConversation sequence)
  // when receving new message or send new message
  updateSelectedConversationMessageSequence: (newMessage) => {
    const selectedConversation = get().selectedConversation;

    if (
      newMessage.conversationId === selectedConversation?._id &&
      newMessage.sequence > selectedConversation.latestSentMessageSequence
    ) {
      const updatedSelectedConversation = {
        ...get().selectedConversation,
        latestSentMessageSequence: newMessage.sequence,
      };

      set({ selectedConversation: updatedSelectedConversation });
    }
  },

  // TODO: call it when sending a new message
  // Update front-end unread message numer data (convosInfo sequence)
  // when receving new message or send new message
  updateConvosInfoMessageSequence: (newMessage) =>
    set((state) => {
      const updatedConvos = state.convosInfo.map((convo) => {
        if (
          convo.conversationId._id === newMessage.conversationId &&
          newMessage.sequence > convo.conversationId.latestSentMessageSequence
        ) {
          return {
            ...convo,
            conversationId: {
              ...convo.conversationId,
              latestSentMessageSequence: newMessage.sequence,
            },
          };
        }
        return convo;
      });

      return { convosInfo: updatedConvos };
    }),

  // Update front-end unread message numer data (convoIdtoUnreadMap sequence)
  // when receving new message
  updateConvoIdtoUnreadMap: (conversationId, value) => {
    const updatedConvoIdtoUnreadMap = get().convoIdtoUnreadMap;
    updatedConvoIdtoUnreadMap[conversationId] = value;
    set({ convoIdtoUnreadMap: updatedConvoIdtoUnreadMap });
  },
}));
