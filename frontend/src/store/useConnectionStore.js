import { create } from "zustand";

export const useConnectionStore = create((set, get) => ({
  isConnectionsLoading: false,
  connections: [],

  getConnections: async () => {
    set({ isConnectionsLoading: true });

    // Simulated API delay
    setTimeout(() => {
      const now = new Date();
      const fetchedConnections = [
        {
          _id: "1",
          type: "friend",
          status: "pending",
          name: "Alice Johnson",
          profilePic: "https://i.pravatar.cc/150?img=1",
          groupName: null,
          message: "Hey, What's up?",
          createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
        {
          _id: "2",
          type: "group",
          status: "accepted",
          name: "John Doe",
          profilePic: "https://i.pravatar.cc/150?img=2",
          groupName: "React Devs Group",
          message:
            "Hi, I just invited you to our devs group. You can learn React in this group.",
          createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          _id: "3",
          type: "friend",
          status: "rejected",
          name: "Sophie Lee",
          profilePic: "https://i.pravatar.cc/150?img=3",
          groupName: null,
          message: "Please accepting my friend request.",
          createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        },
      ];

      set({
        connections: fetchedConnections,
        isConnectionsLoading: false,
      });
    }, 1000);
  },

  // Derived state getters
  pendingConnections: () => {
    return get().connections.filter((c) => c.status === "pending");
  },

  respondedConnections: () => {
    return get().connections.filter((c) => c.status !== "pending");
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
}));
