import React from "react";
import { X, UserPlus, NotebookText, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import { useConnectionStore } from "../../../store/useConnectionStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { sendConnection } = useConnectionStore();

  const handleSendConnection = (receiverId) => {
    // Check receiverId is empty or not
    if (!receiverId) {
      console.log("Function errored because of receving empty receiverId");
      toast.error("Sorry, an error occurs");
      return;
    }

    // Send a connection
    sendConnection({
      type: "friend",
      receiverId: receiverId,
      // Keep groupName field to always to NULL instead of empty string
      // for friend type connection. If using empty string, the back-end
      // query can not find exisitng connections with filter properly
      groupName: null,
      // TODO: update it after adding a send greeting message composer
      message: "",
    });
  };

  const renderConnectButton = () => {
    const status = selectedUser.connectionStatus;

    if (status === "accepted") {
      return (
        <button className="btn btn-xs btn-outline gap-2 ml-1" disabled>
          <UserCheck className="size-4" />
          <span className="hidden xl:inline">Connected</span>
        </button>
      );
    }

    if (status === "pending") {
      return (
        <button className="btn btn-xs btn-outline gap-2 ml-1" disabled>
          <UserPlus className="size-4" />
          <span className="hidden xl:inline">Connection sent</span>
        </button>
      );
    }

    // default for "" and "rejected"
    return (
      <button
        onClick={() => handleSendConnection(selectedUser._id)}
        className="btn btn-xs btn-outline gap-2 ml-1"
      >
        <UserPlus className="size-4" />
        <span className="hidden xl:inline">Connect</span>
      </button>
    );
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* User avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            {/* User name */}
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {/* User oneline status */}
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>

              {/* Conditionally rendered connect button */}
              {/* TODO: fix button size */}
              {renderConnectButton()}

              {/* View moments button */}
              <Link
                to={`/moments/${selectedUser._id}`}
                className="btn btn-xs btn-outline gap-2"
              >
                <NotebookText className="size-4" />
                <span className="hidden xl:inline">moments</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
