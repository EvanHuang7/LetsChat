import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

import { axiosInstance } from "../lib/axios.js";

import { useConversationStore } from "./useConversationStore.js";
import { useMessageStore } from "./useMessageStore.js";

// Backend server base url
const BACK_END_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Zustand is a handy state management tool for
// managing state in React apps
export const useAuthStore = create((set, get) => ({
  // Intialize needed variables
  authUser: null,
  onlineUsers: [],
  socket: null,

  currentPath: "/",
  setCurrentPath: (path) => set({ currentPath: path }),

  // Flags variables to control different spinners
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  // USAGE: Check authentication when app starts
  checkAuth: async () => {
    try {
      // Call the auth check endpoint
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });

      // Connect to socket io whenever refreshing the
      // page (application starts) and auth granted
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      // When api call returns errors, that means
      // user is not authenticated
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // USAGE: Signup a user
  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      // Call the signup endpoint
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Signed up sucessfully");

      // Connect to socket io when signed up sucessfully
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // USAGE: Login a user
  login: async (data) => {
    try {
      set({ isLoggingIn: true });
      // Call the login endpoint
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in sucessfully");

      // Connect to socket io whenever logged in sucessfully
      get().connectSocket();
    } catch (error) {
      console.log("Error in login: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // USAGE: Logout a user
  logout: async () => {
    try {
      // Set potential existing selected conversaton to null before loggout
      // for updating unread message number for this user in this convo
      await useConversationStore.getState().setSelectedConversation(null);
      // Clear any potential message toast of this user, which make
      // sure this message toast not diplay to new user
      useMessageStore.getState().setNewMessageForToast(null);
      // Set the unread num in home icon to 0
      useMessageStore.getState().setUnreadNumInHomeIcon(0);

      // Call the logout endpoint
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logged out sucessfully");

      // Disconnect to socket io whenever logged out sucessfully
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Update user picture in profile page
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      // Call the update-profile endpoint
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });

      toast.success("Updated profile sucessfully");
    } catch (error) {
      console.log("Error in updateProfile: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // USAGE: Add or remove user stickers list in chat box
  updateStickers: async (data) => {
    try {
      // Call the update-stickers endpoint
      const res = await axiosInstance.put("/auth/update-stickers", data);
      set({ authUser: res.data });
      if (data.add) {
        toast.success("Sticker added!");
      } else {
        toast.success("Sticker deleted!");
      }
    } catch (error) {
      console.log("Error in updateStickers: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Toggle user message notification
  toggleMessageNotification: async (data) => {
    try {
      const res = await axiosInstance.put(
        "/auth/toggle-message-notification",
        data
      );
      set({ authUser: res.data });

      if (data.messageNotificationState) {
        toast.success("Message notification is ON now");
      } else {
        toast.success("Message notification is OFF now");
      }
    } catch (error) {
      console.log("Error in toggleMessageNotification: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Create socket io client and start connection to socket io server
  // after checkAuth, signup or login succeed and listen to the "getOnlineUsers" event
  connectSocket: () => {
    const { authUser } = get();
    // If user is not auth granted or already connected to socket,
    // do not connect to socket or connect again
    if (!authUser || get().socket?.connected) return;

    // Create socket io client and start connection to socket io server
    // with passing a query including userId
    const socket = io(BACK_END_BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    // Set the const socket io client object to socket state
    set({ socket: socket });

    // Set the socket io client to listen to the event
    // (any oneline users update) from socket io server
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  // USAGE: Disconnect socket after logout succeed
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
