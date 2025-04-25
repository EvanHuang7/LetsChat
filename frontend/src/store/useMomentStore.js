import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

// Zustand is a handy state management tool for
// managing state in React apps
export const useMomentStore = create((set, get) => ({
  moments: [],

  isMomentsLoading: false,

  // Call API function to get 10 moments of all users or specific user
  getMoments: async (userId, data) => {
    try {
      // Only display the moment skeletons when arrving this page
      if (!data.lastMomentCreatedAt) {
        set({ isMomentsLoading: true });
      }

      // Call the get moment endpoint
      const res = await axiosInstance.post(`/moment/get/${userId}`, data);

      // Get current moments from state
      const currentMoments = get().moments;

      // Filter out moments that are already in the current moments by checking _id
      const newMoments = res.data.filter(
        (moment) =>
          !currentMoments.some(
            (existingMoment) => existingMoment._id === moment._id
          )
      );

      // Update moments state with new moments
      set({ moments: [...currentMoments, ...newMoments] });
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
      const res = await axiosInstance.post(`/comment/post`, data);
      const newComment = res.data; // the newly created comment with populated fields

      // Update the comments list of the correct moment
      set((state) => ({
        moments: state.moments.map((moment) => {
          if (moment._id === newComment.momentId) {
            return {
              ...moment,
              comments: [...(moment.comments || []), newComment],
            };
          }
          return moment;
        }),
      }));

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
      const res = await axiosInstance.post(`/moment/update-like`, data);
      const updatedMoment = res.data;

      set((state) => ({
        moments: state.moments.map((moment) => {
          return moment._id === updatedMoment._id ? updatedMoment : moment;
        }),
      }));

      if (data.like) {
        toast("Thanks your like!", {
          icon: "👍",
        });
      }
    } catch (error) {
      console.log("Error in updateLikeStatus: ", error);
      toast.error(error.response.data.message);
    }
  },
}));
