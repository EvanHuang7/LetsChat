import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";
import { useMessageStore } from "./useMessageStore";

export const useConnectionStore = create((set, get) => ({
  users: [],
  connections: [],
  pendingConnections: [],
  respondedConnections: [],
  isConnectionsLoading: false,

  // Call API function to get connections for logged in user
  getConnections: async () => {
    try {
      set({ isConnectionsLoading: true });
      // Call the get connections endpoint
      const res = await axiosInstance.get(`/connection/get`);

      // Set connections, pendingConnections, and respondedConnections
      set({ connections: res.data });
      set({ pendingConnections: get().getPendingConnections() });
      set({ respondedConnections: get().getRespondedConnections() });
    } catch (error) {
      console.log("Error in getConnections: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isConnectionsLoading: false });
    }
  },

  // Call API function to get all users in new connection page
  getUsersForConnection: async () => {
    try {
      // Call the get connections endpoint
      const res = await axiosInstance.get(`/connection/users`);

      // Set users
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsersForConnection: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Call API function to update connection status for logged in user
  updateConnectionStatus: async (data) => {
    try {
      // Call the update-status endpoint
      const res = await axiosInstance.post(`/connection/update-status`, data);
      const updateConnection = res.data;

      // Replace the updated connection in connections list
      set((state) => ({
        connections: state.connections.map((connection) => {
          return connection._id === updateConnection._id
            ? updateConnection
            : connection;
        }),
      }));
      // Set pendingConnections, and respondedConnections
      set({ pendingConnections: get().getPendingConnections() });
      set({ respondedConnections: get().getRespondedConnections() });

      if (data.status === "accepted") {
        toast("Connection or invite accepted", {
          icon: "👏",
        });
      } else {
        toast("Connection or invite declined", {
          icon: "👋",
        });
      }
    } catch (error) {
      console.log("Error in updateConnectionStatus: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Call API function to send a connection status
  // from logged in user to selected user
  sendConnection: async (data) => {
    try {
      // Call the send connection endpoint
      await axiosInstance.post(`/connection/send`, data);

      // Update connection status for selectedUser
      const selectedUser = useMessageStore.getState().selectedUser;
      selectedUser.connectionStatus = "pending";
      set({ selectedUser });

      toast("Friend connection sent sucessfully!", {
        icon: "🥳",
      });
    } catch (error) {
      console.log("Error in updateConnectionStatus: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Call API function to get specified connections between two users
  // for logged in user as connection sender
  getSpecifiedConnections: async (data) => {
    try {
      // Call the get-specified endpoint
      const res = await axiosInstance.post(`/connection/get-specified`, data);
      return res.data;
    } catch (error) {
      console.log("Error in getSpecifiedConnection: ", error);
      toast.error(error.response.data.message);
    }
  },

  // Get all pending connections by filtering all connections
  getPendingConnections: () => {
    return get().connections.filter((c) => c.status === "pending");
  },

  // Get all responded connections by filtering all connections
  getRespondedConnections: () => {
    return get().connections.filter((c) => c.status !== "pending");
  },
}));
