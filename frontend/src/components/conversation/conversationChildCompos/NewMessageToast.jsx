import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareShare } from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";

const NewMessageToast = ({ t, newMessageForToast }) => {
  const { currentPath } = useAuthStore();

  const sender = newMessageForToast?.senderId;
  const conversation = newMessageForToast?.conversationId;
  const text = newMessageForToast?.text || "[An image sent]";
  const image = newMessageForToast?.image;

  const isOnHomeOrConversationOrCallPage =
    currentPath === "/" ||
    currentPath.startsWith("/conversation/") ||
    currentPath.startsWith("/call/");

  const navigate = useNavigate();

  const handleToastClick = () => {
    if (!isOnHomeOrConversationOrCallPage && conversation?._id) {
      navigate(`/conversation/${conversation._id}`);
    }
  };

  return (
    newMessageForToast && (
      <div
        onClick={handleToastClick}
        className={`
          ${t.visible ? "animate-enter" : "animate-leave"}
          max-w-sm w-full bg-base-100 text-base-content shadow-lg rounded-lg
          ring-1 ring-base-300 flex pointer-events-auto relative
          ${
            !isOnHomeOrConversationOrCallPage
              ? "cursor-pointer hover:bg-base-200 transition-colors"
              : ""
          }
        `}
      >
        {/* Main content */}
        <div className="flex-1 w-0 p-3">
          <div className="flex items-start gap-3">
            <img
              className="h-8 w-8 rounded-full object-cover border"
              src={sender?.profilePic || "/avatar.png"}
              alt={sender?.fullName || "User"}
            />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {sender?.fullName}
                {conversation?.isGroup && (
                  <span className="text-base-content/70 font-semibold truncate">
                    {" from "}
                    {conversation.groupName}
                  </span>
                )}
              </p>
              <p className="mt-1 text-sm line-clamp-1 text-base-content/90">
                <span className="text-base-content/70 font-semibold">
                  Said:
                </span>{" "}
                {text}
              </p>
            </div>
          </div>
        </div>

        {/* Image on right side (if exists) */}
        {image && (
          <div className="flex-shrink-0 pr-3 py-3">
            <img
              src={image}
              alt="Preview"
              className="w-12 h-12 rounded-md object-cover"
            />
          </div>
        )}
      </div>
    )
  );
};

export default NewMessageToast;
