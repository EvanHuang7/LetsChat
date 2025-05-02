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
        } max-w-md w-full bg-base-100 text-base-content shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-base-300`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full object-cover border"
                src={sender?.profilePic || "/avatar.png"}
                alt={sender?.fullName || "User"}
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium">
                {sender?.fullName}
                {conversation?.isGroup && (
                  <>
                    <span className="text-base-content/70 font-semibold">
                      {" from "} {conversation.groupName}
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 text-sm">{text}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default NewMessageToast;
