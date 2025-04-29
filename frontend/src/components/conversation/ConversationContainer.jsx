import React, { useEffect } from "react";

import ConversationHeader from "./conversationChildCompos/ConversationHeader";
import MessagesHistory from "./conversationChildCompos/MessagesHistory";
import MessageInput from "./conversationChildCompos/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";

import { useConversationStore } from "../../store/useConversationStore";
import { useMessageStore } from "../../store/useMessageStore";

const ConversationContainer = () => {
  const { selectedConversation } = useConversationStore();
  const { getMessages, isMessagesLoading } = useMessageStore();

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
        <ConversationHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ConversationHeader />
      <MessagesHistory />
      <MessageInput />
    </div>
  );
};

export default ConversationContainer;
