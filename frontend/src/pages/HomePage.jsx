import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import NoConversation from "../components/conversation/NoConversation";
import ConversationContainer from "../components/conversation/ConversationContainer";

import { useAuthStore } from "../store/useAuthStore";
import { useConversationStore } from "../store/useConversationStore";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const {
    selectedConversation,
    subscribeToNewAcceptedConnection,
    unsubscribeFromNewAcceptedConnection,
  } = useConversationStore();

  useEffect(() => {
    // If user auth granted or a user logged in,
    if (authUser) {
      // Start listening to "newAcceptedFriend" and "newGroupMember"
      // for updating conversations list and selected conversation real time
      subscribeToNewAcceptedConnection();

      // Define a cleanup function. It will be run before the component is
      // removed (unmounted) or before the effect re-runs (if dependencies change)
      return () => {
        unsubscribeFromNewAcceptedConnection();
      };
    }
  }, [authUser]);

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
