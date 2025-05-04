import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

import { useAuthStore } from "./useAuthStore.js";

export const useConnectionStore = create((set, get) => ({
  users: [],
  isUsersLoading: false,

  connections: [],
  pendingConnections: [],
  respondedConnections: [],
  isConnectionsLoading: false,

  friends: [],
  isFriendsLoading: false,

  // USAGE: Get all connections for logged in user in sidebar component to
  // display the pending conversaton numeber and display all connections
  // in new connections page
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

  // USAGE: Get all users to display them in new connection page
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

  // USAGE: send a connection from logged in user to selected user
  // in all users section of new connection page
  sendConnection: async (data) => {
    try {
      // Call the send connection endpoint
      await axiosInstance.post(`/connection/send`, data);

      // Update connection status for selectedUser in users list
      set((state) => ({
        users: state.users.map((user) => {
          return user._id === data.selectedUserId
            ? {
                ...user,
                connectionStatus: "pending",
              }
            : user;
        }),
      }));

      toast("Friend connection sent sucessfully!", {
        icon: "🥳",
      });
    } catch (error) {
      console.log("Error in sendConnection: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Display a list of friend users to invite them into a group
  getAllFriendUsersExcludeGroupMemebers: async (data) => {
    try {
      set({ isFriendsLoading: true });
      // Call api to get all friends
      const res = await axiosInstance.post(`/connection/friend-users`, data);

      // Set friends
      set({ friends: res.data });
    } catch (error) {
      console.log("Error in getAllFriendUsersExcludeGroupMemebers: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isFriendsLoading: false });
    }
  },

  // USAGE: Send group invitations to a list of friend users
  sendBatchGroupInvitation: async (data) => {
    try {
      // Call api to seend batch group invitations
      await axiosInstance.post(`/connection/send-batch-group`, data);

      if (data.selectedUserIds.length > 1) {
        toast.success(
          `${data.selectedUserIds.length} friends are invited successfully`
        );
      } else {
        toast.success(
          `${data.selectedUserIds.length} friend is invited successfully`
        );
      }
    } catch (error) {
      console.log("Error in sendBatchGroupInvitation: ", error);
      toast.error(error.response.data.message);
    }
  },

  // USAGE: Accept or reject a connection in new connection page
  updateConnectionStatus: async (data) => {
    try {
      // Call the update-status endpoint
      const res = await axiosInstance.post(`/connection/update-status`, data);
      const updateConnection = res.data.updatedConnection;

      // We can handle res.data.convoInfoOfUser here, but it's not needed now

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

  // USAGE: Set socket client to listen to "newConnection" event from
  // socket server in navbar component for auth user
  subscribeToConnections: () => {
    const socket = useAuthStore.getState().socket;

    // Listen to "newConnection" event
    socket.on("newConnection", (newConnection) => {
      // Udpate existing connection if change existing rejected to pending
      // or add newConnection to connections list
      const existing = get().connections.find(
        (connection) => connection._id === newConnection._id
      );

      if (existing) {
        // Replace the existing connection
        set((state) => ({
          connections: state.connections.map((connection) =>
            connection._id === newConnection._id ? newConnection : connection
          ),
        }));
      } else {
        // Add to the top of the list
        set((state) => ({
          connections: [newConnection, ...state.connections],
        }));
      }
      // Set pendingConnections, and respondedConnections
      set({ pendingConnections: get().getPendingConnections() });
      set({ respondedConnections: get().getRespondedConnections() });
    });
  },

  // USAGE: Unsubscribe from "newConnection" event when navbar component destroyed
  unsubscribeFromConnections: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newConnection");
  },

  // USAGE:
  // Get specified connections between two users for logged in user as connection sender
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

  // USAGE: Show all pending connections in pending connections section
  getPendingConnections: () => {
    return get().connections.filter((c) => c.status === "pending");
  },

  // USAGE: Show all responded connections in responded connections section
  getRespondedConnections: () => {
    return get().connections.filter((c) => c.status !== "pending");
  },
}));
