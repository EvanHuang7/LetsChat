import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

// Zustand is a handy state management tool for
// managing state in React apps
export const useMomentStore = create((set, get) => ({
  moments: [],

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
      set({ moments: [...moments, res.data] });

      toast.success("Posted a moment sucessfully");
    } catch (error) {
      console.log("Error in postMoment: ", error);
      toast.error(error.response.data.message);
    }
  },
}));
