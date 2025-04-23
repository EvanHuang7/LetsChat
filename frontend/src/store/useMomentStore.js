import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

// Zustand is a handy state management tool for
// managing state in React apps
export const useMomentStore = create((set, get) => ({
  moments: [],

  isMomentsLoading: false,

  // Call API function to get moments of all users or specific user
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

  // Call API function to post a moment for logged in user
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

  // Call API function to post a comment for logged in user
  postComment: async (data) => {
    try {
      // Call the post comment endpoint
      await axiosInstance.post(`/comment/post`, data);

      // TODO: Add api res comment to exisiting comments list of moment

      toast.success("Posted a comment sucessfully");
    } catch (error) {
      console.log("Error in postComment: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Call API function to update like status for logged in user
  updateLikeStatus: async (data) => {
    try {
      // Call the update-like endpoint
      await axiosInstance.post(`/moment/update-like`, data);

      // TODO: Optional: Change api res updated momemnt to exisiting moment
    } catch (error) {
      console.log("Error in updateLikeStatus: ", error);
      toast.error(error.response.data.message);
    }
  },
}));
