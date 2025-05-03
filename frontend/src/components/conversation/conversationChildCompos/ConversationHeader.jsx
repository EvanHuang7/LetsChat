import React from "react";
import { X, Users, NotebookText, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";

const ConversationHeader = () => {
  const { onlineUsers } = useAuthStore();
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  const navigate = useNavigate();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between w-full">
        {selectedConversation.isGroup ? (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* group avatar */}
            <div className="avatar shrink-0">
              <div className="size-12 rounded-full relative">
                <img
                  src={selectedConversation.groupImageUrl || "/groupAvatar.png"}
                  alt={selectedConversation.groupName}
                />
              </div>
            </div>

            {/* group info */}
            <div className="min-w-0">
              {/* group name with icon */}
              <div className="flex items-center gap-2 truncate">
                <Users className="size-4 shrink-0" />
                <h3 className="font-medium truncate">
                  {selectedConversation.groupName}
                </h3>
              </div>

              {/* group member count and buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm text-base-content/70">
                  {selectedConversation.userIds.length} members
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            {/* friend avatar */}
            <div className="avatar shrink-0">
              <div className="size-12 rounded-full relative">
                <img
                  src={selectedConversation.friend.profilePic || "/avatar.png"}
                  alt={selectedConversation.friend.fullName}
                />
              </div>
            </div>

            {/* friend info */}
            <div className="min-w-0">
              {/* friend name */}
              <h3 className="font-medium truncate">
                {selectedConversation.friend.fullName}
              </h3>
              {/* friend status and buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* friend oneline status */}
                <p className="text-sm text-base-content/70 min-w-[50px]">
                  {onlineUsers.includes(selectedConversation.friend._id)
                    ? "Online"
                    : "Offline"}
                </p>

                {/* Connected button */}
                <button
                  className="btn btn-xs btn-outline gap-2 ml-1 border-2 min-h-[25px] 
                  border-base-content/20 opacity-100 pointer-events-none"
                  disabled
                >
                  <UserCheck className="size-4" />
                  <span className="hidden lg:inline">Connected</span>
                </button>

                {/* View moments button */}
                <Link
                  to={`/moments/${selectedConversation.friend._id}`}
                  className="btn btn-xs btn-outline gap-2 min-h-[20px]"
                >
                  <NotebookText className="size-4" />
                  <span className="hidden lg:inline">Moments</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => {
            setSelectedConversation(null);
            navigate(`/`);
          }}
          className="shrink-0 ml-2"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
