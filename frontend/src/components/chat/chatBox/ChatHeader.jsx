import React from "react";
import { X, Users, NotebookText, UserCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
import { useConversationStore } from "../../../store/useConversationStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {selectedConversation.isGroup ? (
          <div className="flex items-center gap-3">
            {/* group avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedConversation.groupImageUrl || "/avatar.png"}
                  alt={selectedConversation.groupName}
                />
              </div>
            </div>

            {/* group name */}
            <div className="flex items-center gap-2">
              <Users className="size-5" />
              <h3 className="font-medium">{selectedConversation.groupName}</h3>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* friend avatar */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img
                  src={selectedConversation.friend.profilePic || "/avatar.png"}
                  alt={selectedConversation.friend.fullName}
                />
              </div>
            </div>

            {/* friend info */}
            <div>
              {/* friend name */}
              <h3 className="font-medium">
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
                  <span className="hidden xl:inline">Connected</span>
                </button>

                {/* View moments button */}
                <Link
                  to={`/moments/${selectedConversation.friend._id}`}
                  className="btn btn-xs btn-outline gap-2"
                >
                  <NotebookText className="size-4" />
                  <span className="hidden xl:inline">moments</span>
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
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
