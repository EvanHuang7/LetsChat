import React, { useRef, useEffect, useState } from "react";
import { SmilePlus } from "lucide-react";
import toast from "react-hot-toast";

import { formatMessageTime } from "../../../lib/utils";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";
import { useMessageStore } from "../../../store/useMessageStore";

const MessagesHistory = () => {
  const { authUser, updateStickers } = useAuthStore();
  const { selectedConversation } = useConversationStore();
  const { messages } = useMessageStore();

  // Watch for conversation change
  const [prevConversationId, setPrevConversationId] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const containerRef = useRef(null);
  const messageEndRef = useRef(null);
  // Count how many images are in the message list
  const totalImages = messages.filter((msg) => msg.image).length;

  // Reset scroll and loading state on conversation switch
  useEffect(() => {
    setShowMessages(false);
    setImagesLoaded(0);
  }, [selectedConversation._id]);

  // Scroll only when all images are loaded
  useEffect(() => {
    if (imagesLoaded >= totalImages) {
      // Don't show scroll when intailizing or switching conversation
      if (selectedConversation._id !== prevConversationId) {
        setPrevConversationId(selectedConversation._id);

        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        setShowMessages(true);

        // Show scroll when a new sent or receveid message
      } else {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [selectedConversation._id, imagesLoaded, totalImages, messages]);

  // Function for handling the click event on the "Add to sticker" button
  const saveImageToGif = (imageUrl) => {
    // Check input
    if (!imageUrl) {
      console.log("Function errored because sticker url is required");
      toast.error("Sorry, no sticker found");
      return;
    }

    // Call updateStickers api function
    updateStickers({
      add: true,
      stickerUrl: imageUrl,
    });
  };

  // Utility to detect and linkify URLs in plain text
  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const currentOrigin = window.location.origin;

    return text.split(urlRegex).map((part, i) => {
      if (urlRegex.test(part)) {
        const isCallLink = part.startsWith(`${currentOrigin}/call/`);

        return (
          <a
            key={i}
            href={part}
            target={isCallLink ? "_self" : "_blank"}
            rel={isCallLink ? undefined : "noopener noreferrer"}
            className="text-blue-500 hover:underline break-all"
          >
            {part}
          </a>
        );
      } else {
        return <span key={i}>{part}</span>;
      }
    });
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 space-y-4 transition-opacity duration-200 ${
        showMessages ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      ref={containerRef}
    >
      {messages.map((message) => (
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
                    : selectedConversation.userIdToInfoMap[message.senderId]
                        ?.profilePic || "/avatar.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          {/* Time */}
          <div className="text-xs chat-header mb-1 ml-0.5">
            <div className="opacity-70">
              {selectedConversation.isGroup &&
                selectedConversation.userIdToInfoMap[message.senderId]
                  ?.fullName}
            </div>
            <time className="opacity-50">
              {formatMessageTime(message.createdAt)}
            </time>
          </div>
          {/* Bubble */}
          <div className="chat-bubble flex flex-col">
            {message.image && (
              <img
                src={message.image}
                alt="Attachment"
                style={{
                  maxWidth: window.innerWidth < 430 ? "80px" : "200px",
                  minWidth: window.innerWidth < 430 ? "60px" : "120px",
                }}
                className="md:max-w-[250px] rounded-md mb-2 object-contain"
                onLoad={() => setImagesLoaded((prev) => prev + 1)}
                onError={(e) => {
                  setImagesLoaded((prev) => prev + 1);
                  e.target.onerror = null; // prevent infinite loop
                  e.target.src = "/fallback-image.png"; // fallback image
                }}
              />
            )}
            {message.text && <p>{linkifyText(message.text)}</p>}
          </div>
          {/* Add to sticker button with tooltip */}
          {message.image && !message.text && (
            <div className="relative group">
              {/* Tooltip */}
              <div
                className={`absolute ${
                  message.senderId === authUser._id
                    ? "bottom-8 right-0 -rotate-15 "
                    : "bottom-8 left-15 rotate-15 "
                }  right-0 mx-auto text-center hidden group-hover:block`}
              >
                <div
                  className={`animate-bounce text-orange-400 text-2xl font-black`}
                >
                  Add sticker!
                </div>
              </div>

              {/* Button */}
              <button
                type="button"
                onClick={() => saveImageToGif(message.image)}
                className={`absolute btn btn-sm btn-circle text-zinc-500 hover:text-primary ${
                  message.senderId === authUser._id
                    ? "bottom-1 right-1"
                    : "bottom-1 -right-22"
                }`}
              >
                <SmilePlus size={20} />
              </button>
            </div>
          )}
        </div>
      ))}

      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesHistory;
