import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore";

// Zustand is a handy state management tool for
// managing state in React apps
export const useMomentStore = create((set, get) => ({
  moments: [],
  // The Id of moment opening the comment writer box
  activeCommentMomentId: null,
  // Current comment text in comment writer box
  commentText: "",

  isMomentsLoading: false,

  // Function to make HTTP call to "api/moment/:id" endpoint
  getMoments: async (userId) => {
    try {
      set({ isMomentsLoading: true });
      // Call the get moment endpoint
      const res = await axiosInstance.get(`/moment/${userId}`);
      set({ moments: res.data });
    } catch (error) {
      console.log("Error in getMoments: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMomentsLoading: false });
    }
  },

  // Function to make HTTP call to "api/moment/post" endpoint
  postMoment: async (data) => {
    try {
      const { moments } = get();
      // Call the post moment endpoint
      const res = await axiosInstance.post(`/moment/post`, data);
      // Add new post moment to moments list
      set({ moments: [res.data, ...moments] });

      toast.success("Posted a moment sucessfully");
    } catch (error) {
      console.log("Error in postMoment: ", error);
      toast.error(error.response.data.message);
    }
  },

  setActiveCommentMomentId: (id) => set({ activeCommentMomentId: id }),
  setCommentText: (text) => set({ commentText: text }),

  // Function to open or close commdent writer box
  toggleCommentBox: (momentId) => {
    const { activeCommentMomentId } = get();
    const isClosing = activeCommentMomentId === momentId;
    set({
      activeCommentMomentId: isClosing ? null : momentId,
      // Clear the comment text if closing the box
      commentText: isClosing ? "" : get().commentText,
    });
  },

  // Call API function to post a comment for logged in user
  postComment: async () => {
    try {
      const data = {
        momentId: get().activeCommentMomentId,
        text: get().commentText,
      };

      // Call the post comment endpoint
      await axiosInstance.post(`/comment/post`, data);
      // TODO: Add api res comment to exisiting comments list of moment

      // clear comment text and close comment writer box after posting
      get().toggleCommentBox(null);

      toast.success("Posted a comment sucessfully");
    } catch (error) {
      console.log("Error in postComment: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Call API function to update like status for logged in user
  updateLikeStatus: async (moment) => {
    try {
      const authUser = useAuthStore.getState().authUser;

      const data = {
        momentId: moment._id,
        like: !moment.userIdsOfLike.includes(authUser._id),
      };

      // Call the update-like endpoint
      await axiosInstance.post(`/moment/update-like`, data);
      // TODO: Change api res updated momemnt to exisiting moment
    } catch (error) {
      console.log("Error in updateLikeStatus: ", error);
      toast.error(error.response.data.message);
    }
  },
}));
