import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

export const useConnectionStore = create((set, get) => ({
  connections: [],
  isConnectionsLoading: false,

  // Call API function to get connections for logged in user
  getConnections: async () => {
    try {
      set({ isConnectionsLoading: true });
      // Call the get connections endpoint
      const res = await axiosInstance.get(`/connection/get`);
      set({ connections: res.data });
    } catch (error) {
      console.log("Error in getConnections: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isConnectionsLoading: false });
    }
  },

  respondToConnection: (id, accepted) => {
    const updatedConnections = get().connections.map((c) => {
      if (c._id === id) {
        return { ...c, status: accepted ? "accepted" : "rejected" };
      }
      return c;
    });
    set({ connections: updatedConnections });
  },

  // Get all pending connections by filtering all connections
  pendingConnections: () => {
    return get().connections.filter((c) => c.status === "pending");
  },

  // Get all responded connections by filtering all connections
  respondedConnections: () => {
    return get().connections.filter((c) => c.status !== "pending");
  },
}));
