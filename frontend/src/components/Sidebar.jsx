import React, { useEffect } from "react";
import { Users, Contact } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";

import { useAuthStore } from "../store/useAuthStore";
import { useConversationStore } from "../store/useConversationStore";

const Sidebar = () => {
  const { onlineUsers } = useAuthStore();
  const {
    convosInfo,
    getConvosInfo,
    selectedConversation,
    setSelectedConversation,
    convoIdtoUnreadMap,
    isConvosInfoLoading,
  } = useConversationStore();

  const navigate = useNavigate();
  // Grabs the conversationId from "/:conversationId" route
  const { conversationId } = useParams();

  // Triger the logic insdie when sidebar component starts
  useEffect(() => {
    // Call getConvosInfo() function to get users list for sidebar
    getConvosInfo();
  }, [getConvosInfo]);

  // When conversationId found from "conversation/:conversationId" route
  useEffect(() => {
    if (convosInfo.length > 0 && conversationId && !selectedConversation) {
      const foundConvoInfo = convosInfo.find(
        (convoInfo) => convoInfo.conversationId._id === conversationId
      );
      if (foundConvoInfo) {
        setSelectedConversation(foundConvoInfo.conversationId);
      }
    }
  }, [convosInfo, conversationId, setSelectedConversation]);

  // Display a loading state if conversations are loading
  if (isConvosInfoLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Contact className="size-8 lg:size-6" />
          <span className="font-medium hidden lg:block">All conversations</span>
        </div>
      </div>

      {/* Display each conversation */}
      <div className="overflow-y-auto w-full py-3">
        {convosInfo.map((convoInfo) => (
          <button
            key={convoInfo.conversationId._id}
            onClick={() => {
              setSelectedConversation(convoInfo.conversationId);
              navigate(`/conversation/${convoInfo.conversationId._id}`);
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedConversation?._id === convoInfo.conversationId._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            {/* conversation avator and green, red dots */}
            <div className="relative size-12 shrink-0">
              <img
                src={
                  (convoInfo.conversationId.isGroup
                    ? convoInfo.conversationId.groupImageUrl
                    : convoInfo.conversationId.friend.profilePic) ||
                  (convoInfo.conversationId.isGroup
                    ? "/groupAvatar.png"
                    : "/avatar.png")
                }
                alt={
                  convoInfo.conversationId.isGroup
                    ? convoInfo.conversationId.groupName
                    : convoInfo.conversationId.friend.fullName
                }
                className="w-full h-full object-cover rounded-full"
              />

              {/* 🔴 Conversation unread message badge */}
              {convoIdtoUnreadMap?.[convoInfo.conversationId._id] > 0 && (
                <span
                  className="absolute -top-2 -right-2 min-w-[1.25rem] h-5 px-1 text-xs font-semibold 
                  text-white bg-red-500 rounded-full flex items-center justify-center shadow-md"
                >
                  {convoIdtoUnreadMap[convoInfo.conversationId._id]}
                </span>
              )}

              {/* 🟢 User Online green dot icon */}
              {!convoInfo.conversationId.isGroup &&
                onlineUsers.includes(convoInfo.conversationId.friend._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
            </div>

            <div className="hidden lg:block text-left min-w-0 w-full">
              {convoInfo.conversationId.isGroup ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="size-4 shrink-0" />
                    <span className="font-medium truncate block overflow-hidden whitespace-nowrap">
                      {convoInfo.conversationId.groupName}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-400">
                    {convoInfo.conversationId.userIds.length} members
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium truncate block overflow-hidden whitespace-nowrap">
                    {convoInfo.conversationId.friend.fullName}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(convoInfo.conversationId.friend._id)
                      ? "Online"
                      : "Offline"}
                  </div>
                </>
              )}
            </div>
          </button>
        ))}
        {/* No conversatons state */}
        {convosInfo.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No conversations</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
