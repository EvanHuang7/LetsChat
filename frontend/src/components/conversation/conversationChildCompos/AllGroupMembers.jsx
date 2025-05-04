import React, { useState } from "react";
import { Ellipsis, X, Crown } from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";

const AllGroupMembers = () => {
  const { onlineUsers } = useAuthStore();
  const { selectedConversation } = useConversationStore();

  const [showAllMembersModal, setShowAllMembersModal] = useState(false);

  const users = selectedConversation.userIds || [];
  const MAX_DISPLAY = 5;
  const displayUsers = users.slice(0, MAX_DISPLAY);
  const hasMoreUsers = users.length > MAX_DISPLAY;
  return (
    <div>
      {" "}
      <div className="space-y-1.5">
        <p className="text-sm font-medium">Members</p>
        <div className="grid grid-cols-3 gap-4">
          {displayUsers.map((user) => (
            <div key={user._id} className="flex flex-col items-center">
              <div className="relative">
                {user._id === selectedConversation?.groupCreaterId && (
                  <Crown className="size-5 absolute -top-2 -right-1 text-yellow-500 bg-base-100 rounded-full p-0.5 shadow-md" />
                )}
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full border border-base-300"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
              rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <p className="text-xs text-center mt-1 truncate w-full">
                {user.fullName}
              </p>
            </div>
          ))}
          {hasMoreUsers && (
            <button
              onClick={() => setShowAllMembersModal(true)}
              className="flex flex-col items-center justify-center size-13 rounded-full border border-base-300 bg-base-200 hover:bg-base-300 transition"
              title="Show all members"
            >
              <Ellipsis className="w-4 h-4 text-base-content" />
              <span className="text-xs mt-1">More</span>
            </button>
          )}
        </div>
      </div>
      {/* Show all members modal */}
      {showAllMembersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-base-100 rounded-lg shadow-lg max-w-xl w-full p-5 relative max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-base-content hover:text-error"
              onClick={() => setShowAllMembersModal(false)}
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4 text-center">
              All Members
            </h3>

            <div className="grid grid-cols-6 gap-4">
              {users.map((user) => (
                <div key={user._id} className="flex flex-col items-center">
                  <div className="relative">
                    {user._id === selectedConversation?.groupCreaterId && (
                      <Crown className="size-5 absolute -top-2 -right-1 text-yellow-500 bg-base-100 rounded-full p-0.5 shadow-md" />
                    )}
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full border border-base-300"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span
                        className="absolute bottom-0 right-0 size-3 bg-green-500 
              rounded-full ring-2 ring-zinc-900"
                      />
                    )}
                  </div>
                  <p className="text-xs text-center mt-1 truncate w-full">
                    {user.fullName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllGroupMembers;
