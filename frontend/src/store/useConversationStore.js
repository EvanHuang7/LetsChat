import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

import { useAuthStore } from "./useAuthStore.js";

export const useConversationStore = create((set, get) => ({
  // This is an array of "convoInfoOfUser" object
  convosInfo: [],
  isConvosInfoLoading: false,

  selectedConversation: null,
  convoIdtoUnreadMap: null,

  isGroupImgUploading: false,
  isEditingGroupName: false,
  setIsEditingGroupName: (value) => set({ isEditingGroupName: value }),

  // USAGE: Get all conversations info in sidebar for logged in user
  getConvosInfo: async () => {
    try {
      set({ isConvosInfoLoading: true });

      // Call the endpoint
      const res = await axiosInstance.get("/convoInfoOfUser/getAll");
      const convosInfo = res.data;

      // Set convosInfo and build convoIdtoUnreadMap
      get().setConvosInfo(convosInfo);
    } catch (error) {
      console.log("Error in getConvosInfo: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isConvosInfoLoading: false });
    }
  },

  // USAGE: Only 1 place in front-end to create a conversation.
  // Logged in user creates a Group conversation from sidebar.
  createConversation: async (data) => {
    try {
      // Call endpoint
      const res = await axiosInstance.post("/conversation/create", data);
      const newConvoInfo = res.data.convoInfoOfUser;

      // Add new newConvoInfo to existing convosInfo list
      // and build convoIdtoUnreadMap again
      get().addConvoInfo(newConvoInfo);
    } catch (error) {
      console.log("Error in createConversation: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Only 1 place in front-end to update a conversation.
  // Group creater to update a group conversation info.
  updateGroupConversation: async (updateGroupImage, data) => {
    try {
      if (updateGroupImage) {
        set({ isGroupImgUploading: true });
      }

      // Call endpoint
      const res = await axiosInstance.post("/conversation/update-group", data);
      const convoInfoOfUser = res.data.convoInfoOfUser;

      // Replace updated ConvoInfo in existing convosInfo list
      // and build convoIdtoUnreadMap again and update selectedConversation.
      get().updateConvosInfoWithUpdatedConvo(convoInfoOfUser);
      get().updateSelectedConvoWithUpdatedConvo(convoInfoOfUser.conversationId);

      if (updateGroupImage) {
        toast.success("Group image updated");
      } else {
        toast.success("Group name updated");
      }
    } catch (error) {
      console.log("Error in updateGroupConversation: ", error);
      toast.error(error.response.data.message);
    } finally {
      if (updateGroupImage) {
        set({ isGroupImgUploading: false });
      } else {
        set({ isEditingGroupName: false });
      }
    }
  },

  // USAGE: Update unread message number in DB when selecting or leaving conversation
  callUpdateConvoInfoOfUserAPI: async (conversation) => {
    try {
      // Call endpoint
      await axiosInstance.post("/convoInfoOfUser/update", {
        conversationId: conversation._id,
        lastReadMessageSequence: conversation.latestSentMessageSequence,
      });
    } catch (error) {
      console.log("Error in callUpdateConvoInfoOfUserAPI: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Function to set a selected conversation (trigged by user action)
  // USAGE: Udpate back-end unread message number for logged in user
  // when selecting or leaving conversation.
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
      await get().callUpdateConvoInfoOfUserAPI(previousConversation);
    }

    // If selecting a conversation from null or from previous conversation,
    // clear unread message number for current selected conversation
    // and clear previous conversation unread message num in next If state
    if (selectedConversation) {
      // Call endpoint to udpate back-end data
      await get().callUpdateConvoInfoOfUserAPI(selectedConversation);

      // Reset this conversation unread num in front-end to 0
      get().updateConvoIdtoUnreadMap(selectedConversation._id, 0);
    }
  },

  // USAGE: Set socket client to listen to "newAcceptedFriend" and
  // "newGroupMember" events from socket server in home component.
  subscribeToNewAcceptedConnection: () => {
    const socket = useAuthStore.getState().socket;

    // Listen to "newAcceptedFriend" event and add newConvoInfoOfUser to
    // existing convosInfo list
    socket.on("newAcceptedFriend", (newConvoInfoOfUser) => {
      get().addConvoInfo(newConvoInfoOfUser);
    });

    // Listen to "newGroupMember" event and update newConvoInfoOfUser of
    // new group member in existing convosInfo list and selected converstion
    socket.on("newGroupMember", (newConvoInfoOfUser) => {
      // Update convosInfo list with only conversation info of newConvoInfoOfUser
      // because the userId and lastReadMessageSequence fields are new group member
      get().updateConvosInfoWithUpdatedConvo(newConvoInfoOfUser);

      // Update selected conversation if they have same conversatonId
      get().updateSelectedConvoWithUpdatedConvo(
        newConvoInfoOfUser.conversationId
      );
    });
  },

  // USAGE: Unsubscribe from "newAcceptedFriend" and "newGroupMember"
  // events when home component destroyed
  unsubscribeFromNewAcceptedConnection: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newAcceptedFriend");
    socket.off("newGroupMember");
  },

  // USAGE: update convosInfo list after 1 convo udpated
  // after group creater updated group conversation info.
  updateConvosInfoWithUpdatedConvo: (updatedConvoInfoOfUser) =>
    set((state) => {
      const updatedConvos = state.convosInfo.map((convo) => {
        if (
          convo.conversationId._id === updatedConvoInfoOfUser.conversationId._id
        ) {
          return {
            ...convo,
            conversationId: updatedConvoInfoOfUser.conversationId,
          };
        }
        return convo;
      });

      return { convosInfo: updatedConvos };
    }),

  // USAGE: update selected conversation after its info updated.
  // after group creater updated group conversation info.
  updateSelectedConvoWithUpdatedConvo: (updatedConversation) => {
    // Only update selected conversation if they are same id
    if (get().selectedConversation._id === updatedConversation._id) {
      set({ selectedConversation: updatedConversation });
      // Build userIdToInfoMap again
      get().buildUserIdToInfoMap(updatedConversation);
    }
  },

  // USAGE: Build convoIdtoUnreadMap when getting all convosInfo in sidebar
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

  // USAGE: Build userIdToInfoMap when selecting a conversation
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

  // USAGE: Update front-end unread message numer data (selectedConversation sequence)
  // when receving new message or send new message
  updateSelectedConversationWithNewMessage: (newMessage) => {
    const selectedConversation = get().selectedConversation;

    if (
      newMessage.conversationId === selectedConversation?._id &&
      newMessage.sequence > selectedConversation?.latestSentMessageSequence
    ) {
      const updatedSelectedConversation = {
        ...get().selectedConversation,
        latestSentMessageSequence: newMessage.sequence,
      };

      set({ selectedConversation: updatedSelectedConversation });
    }
  },

  // USAGE: Update front-end unread message numer data (convosInfo sequence)
  // when receving new message or send new message
  updateConvosInfoWithNewMessage: (newMessage) =>
    set((state) => {
      const updatedConvos = [];
      let updatedConvo = null;

      for (const convo of state.convosInfo) {
        if (
          convo.conversationId._id === newMessage.conversationId &&
          newMessage.sequence > convo.conversationId.latestSentMessageSequence
        ) {
          updatedConvo = {
            ...convo,
            conversationId: {
              ...convo.conversationId,
              latestSentMessageSequence: newMessage.sequence,
            },
          };
        } else {
          updatedConvos.push(convo);
        }
      }

      if (updatedConvo) {
        // Put updated convo with new message at start
        updatedConvos.unshift(updatedConvo);
      }

      return { convosInfo: updatedConvos };
    }),

  // USAGE: Update front-end unread message numer data (convoIdtoUnreadMap sequence)
  // when receving new message
  updateConvoIdtoUnreadMap: (conversationId, value) => {
    const updatedConvoIdtoUnreadMap = get().convoIdtoUnreadMap;

    if (updatedConvoIdtoUnreadMap) {
      updatedConvoIdtoUnreadMap[conversationId] = value;
      set({ convoIdtoUnreadMap: updatedConvoIdtoUnreadMap });
    }
  },

  // USAGE: Set convosInfo and build convoIdtoUnreadMap after
  // getting all convosInfo from getConvosInfo() call
  setConvosInfo: (convosInfo) => {
    set({ convosInfo: convosInfo });
    get().buildConvoIdtoUnreadMap(convosInfo);
  },

  // USAGE: Add a new convosInfo to existing convosInfo list and
  // build convoIdtoUnreadMap again after creating a new
  // conversation from createConversation() call
  addConvoInfo: (newConvoInfo) => {
    set({ convosInfo: [newConvoInfo, ...get().convosInfo] });
    get().buildConvoIdtoUnreadMap(get().convosInfo);
  },
}));
