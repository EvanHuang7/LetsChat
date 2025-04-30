import React, { useEffect } from "react";

import ConversationHeader from "./conversationChildCompos/ConversationHeader";
import MessagesHistory from "./conversationChildCompos/MessagesHistory";
import MessageInput from "./conversationChildCompos/MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import ConversationDetailsPanel from "./conversationChildCompos/ConversationDetailsPanel";

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

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-auto">
        <ConversationHeader />
        {isMessagesLoading ? (
          <>
            <MessageSkeleton />
          </>
        ) : (
          <>
            <MessagesHistory />
          </>
        )}
        <MessageInput />
      </div>

      {/* Right side panel for group conversation */}
      {selectedConversation.isGroup && <ConversationDetailsPanel />}
    </div>
  );
};

export default ConversationContainer;
