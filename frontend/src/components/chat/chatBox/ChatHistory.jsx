import React, { useRef, useEffect, useState } from "react";

import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { formatMessageTime } from "../../../lib/utils";

const ChatHistory = () => {
  const { messages, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // Count how many images are in the message list
  const totalImages = messages.filter((msg) => msg.image).length;

  // Scroll only when all images are loaded
  useEffect(() => {
    if (imagesLoaded >= totalImages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [imagesLoaded, totalImages, messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, idx) => (
        <div
          key={message._id}
          className={`chat ${
            message.senderId === authUser._id ? "chat-end" : "chat-start"
          }`}
        >
          {/* Avatar */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId === authUser._id
                    ? authUser.profilePic || "/avatar.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          {/* Time */}
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          {/* Bubble */}
          <div className="chat-bubble flex flex-col">
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                className="sm:max-w-[300px] rounded-md mb-2"
                onLoad={() => setImagesLoaded((prev) => prev + 1)}
              />
            )}
            {message.text && <p>{message.text}</p>}
          </div>
        </div>
      ))}

      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatHistory;
