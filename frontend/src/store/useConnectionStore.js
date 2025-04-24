import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

export const useConnectionStore = create((set, get) => ({
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
    } catch (error) {
      console.log("Error in updateConnectionStatus: ", error);
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
