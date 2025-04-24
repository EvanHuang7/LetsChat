import React from "react";
import { X, UserPlus, NotebookText } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import { useConnectionStore } from "../../../store/useConnectionStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { sendConnection } = useConnectionStore();

  const handleConnectFriend = (receiverId) => {
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
      // TODO: update it after adding a send greeting message composer
      message: "",
    });
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
              {/* Connect friend button */}
              {/* TODO: change the button according to connection status */}
              <button
                onClick={() => handleConnectFriend(selectedUser._id)}
                className="btn btn-xs btn-outline gap-2 ml-1"
              >
                <UserPlus className="size-4" />
                <span className="hidden xl:inline">Connect</span>
              </button>

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
