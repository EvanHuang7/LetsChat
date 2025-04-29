import React from "react";

import Sidebar from "../components/Sidebar";
import NoConversation from "../components/conversation/NoConversation";
import ConversationContainer from "../components/conversation/ConversationContainer";

import { useConversationStore } from "../store/useConversationStore";

const HomePage = () => {
  const { selectedConversation } = useConversationStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedConversation ? (
              <NoConversation />
            ) : (
              <ConversationContainer />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
