import React, { useEffect } from "react";

import { useChatStore } from "../../store/useChatStore";
import { useConversationStore } from "../../store/useConversationStore";

import ChatHeader from "./chatBox/ChatHeader";
import ChatHistory from "./chatBox/ChatHistory";
import MessageInput from "./chatBox/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { getMessages, isMessagesLoading } = useChatStore();
  const { selectedConversation } = useConversationStore();

  // Do something when chat container component starts
  // We should call useEffect() before any logic conditions
  useEffect(() => {
    // Call functions
    getMessages(selectedConversation._id);

    // Effect will only activate if the values in the list change.
  }, [selectedConversation._id, getMessages]);

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
