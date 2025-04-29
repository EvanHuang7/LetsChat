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

  // Function to set a selected conversation
  setSelectedConversation: async (selectedConversation) => {
    const previousConversation = get().selectedConversation;
    set({ selectedConversation });

    console.log("previousConversation", previousConversation);
    console.log("selectedConversation", selectedConversation);

    // Build userIdToInfoMap of selecting a conversation
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

    // TODO: If go to one conversation from previous conversation,
    // call endpoint clear the unread in Db for previous conversation

    // If selecting a conversation from null, only clear unread
    // message number for current selected conversation
    if (selectedConversation) {
      console.log("update selectedConversation", selectedConversation);

      // Call endpoint
      await axiosInstance.post("/convoInfoOfUser/update", {
        conversationId: selectedConversation._id,
        lastReadMessageSequence: selectedConversation.latestSentMessageSequence,
      });

      // Reset this conversation unread num in front-end to 0
      get().updateConvoIdtoUnreadMap(selectedConversation._id, 0);
    }

    // If closing a conversation from X button or go to another page.
    if (!selectedConversation && previousConversation) {
      console.log("update previous convo", previousConversation);

      // Call endpoint
      await axiosInstance.post("/convoInfoOfUser/update", {
        conversationId: previousConversation._id,
        lastReadMessageSequence: previousConversation.latestSentMessageSequence,
      });
    }
  },

  updateConvoIdtoUnreadMap: (conversationId, value) => {
    const updatedConvoIdtoUnreadMap = get().convoIdtoUnreadMap;
    updatedConvoIdtoUnreadMap[conversationId] = value;
    set({ convoIdtoUnreadMap: updatedConvoIdtoUnreadMap });
  },

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
}));
