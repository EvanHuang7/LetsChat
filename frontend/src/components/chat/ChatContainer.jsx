import React, { useEffect } from "react";

import { useChatStore } from "../../store/useChatStore";
import ChatHeader from "./chatBox/ChatHeader";
import ChatHistory from "./chatBox/ChatHistory";
import MessageInput from "./chatBox/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { selectedUser, getMessages, isMessagesLoading } = useChatStore();

  // Do something when chat container component starts
  // We should call useEffect() before any logic conditions
  useEffect(() => {
    // Call functions
    getMessages(selectedUser._id);

    // Effect will only activate if the values in the list change.
  }, [selectedUser._id, getMessages]);

  // Display a loading state if messages are loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <ChatHistory />
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
