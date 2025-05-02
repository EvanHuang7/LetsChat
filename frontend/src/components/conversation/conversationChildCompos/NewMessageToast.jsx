import React from "react";
import toast from "react-hot-toast";

const NewMessageToast = ({ t, newMessageForToast }) => {
  const sender = newMessageForToast?.senderId;
  const conversation = newMessageForToast?.conversationId;
  const text = newMessageForToast?.text || "[An image sent]";

  return (
    newMessageForToast && (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-base-100 text-base-content shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-base-300`}
      >
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
              <p className="mt-1 text-sm line-clamp-1 text-base-content/80">
                {text}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NewMessageToast;
