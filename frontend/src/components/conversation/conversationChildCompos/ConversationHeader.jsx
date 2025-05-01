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
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* group avatar */}
            <div className="avatar shrink-0">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedConversation.groupImageUrl || "/groupAvatar.png"}
                  alt={selectedConversation.groupName}
                />
              </div>
            </div>

            {/* group name */}
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <Users className="size-5 shrink-0" />
              <div className="flex gap-1 truncate min-w-0">
                <h3 className="font-medium truncate">
                  {selectedConversation.groupName}
                </h3>
                <h3 className="font-medium truncate hidden sm:inline">
                  ({selectedConversation.userIds.length} members)
                </h3>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1">
            {/* friend avatar */}
            <div className="avatar shrink-0">
              <div className="size-10 rounded-full relative">
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
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedConversation.friend._id)
                    ? "Online"
                    : "Offline"}
                </p>

                {/* TODO: update to say connected how many day, Connected button */}
                <button className="btn btn-xs btn-outline gap-2 ml-1" disabled>
                  <UserCheck className="size-4" />
                  <span className="hidden lg:inline">Connected</span>
                </button>

                {/* View moments button */}
                <Link
                  to={`/moments/${selectedConversation.friend._id}`}
                  className="btn btn-xs btn-outline gap-2"
                >
                  <NotebookText className="size-4" />
                  <span className="hidden lg:inline">moments</span>
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
