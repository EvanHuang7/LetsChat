import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

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

      {/* Collapse button */}
      {selectedConversation.isGroup && (
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="z-10 w-4 bg-base-300 hover:bg-base-400 shadow transition hidden lg:block"
        >
          {isPanelCollapsed ? (
            <ChevronLeft className="pr-2" size={24} />
          ) : (
            <ChevronRight className="pr-2" size={24} />
          )}
        </button>
      )}

      {/* Animated right panel */}
      {selectedConversation.isGroup && (
        <div
          className={`
      transition-[max-width,opacity] duration-300 ease-in-out
      overflow-hidden border-l border-base-300 hidden lg:block
      ${isPanelCollapsed ? "max-w-0 opacity-0" : "max-w-[280px] opacity-100"}
    `}
          style={{
            width: isPanelCollapsed ? "0px" : "280px",
          }}
        >
          <div
            className={`
        transition-opacity duration-200 delay-100
        ${isPanelCollapsed ? "opacity-0" : "opacity-100"}
      `}
          >
            <ConversationDetailsPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationContainer;
