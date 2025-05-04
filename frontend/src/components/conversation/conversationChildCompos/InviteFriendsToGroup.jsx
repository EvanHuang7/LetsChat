import React, { useState, useEffect } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";
import { useConnectionStore } from "../../../store/useConnectionStore";

const InviteFriendsToGroup = ({ isGroupAdmin }) => {
  const { onlineUsers } = useAuthStore();
  const { selectedConversation } = useConversationStore();
  const {
    friends,
    isFriendsLoading,
    getAllFriendUsersExcludeGroupMemebers,
    sendBatchGroupInvitation,
  } = useConnectionStore();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  // Get friends list for invitee friends modal to display
  useEffect(() => {
    if (showInviteModal && selectedConversation._id) {
      getAllFriendUsersExcludeGroupMemebers({
        filterUsersFromConvo: true,
        groupConversationId: selectedConversation._id,
      });
    }
  }, [showInviteModal, selectedConversation._id]);

  const handleInviteFriends = async () => {
    await sendBatchGroupInvitation({
      selectedUserIds: selectedFriends,
      groupConversationId: selectedConversation._id,
    });

    // Clear selected friends and hide invite firends modal
    setSelectedFriends([]);
    setShowInviteModal(false);
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  return (
    <div>
      {" "}
      {/* Invite friends button */}
      {isGroupAdmin && (
        <div className="space-y-3">
          <button
            className="btn btn-sm w-full"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="size-4" />
            Invite friends
          </button>
        </div>
      )}
      {/* Invite friends modal */}
      {showInviteModal && (
        <dialog open className="modal">
          <div
            className="modal-box max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Invite Friends</h3>
              <button className="" onClick={() => setShowInviteModal(false)}>
                <X />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-x-2 gap-y-4 max-h-[50vh] overflow-y-auto px-2">
              {isFriendsLoading ? (
                <div className="col-span-6 text-sm text-zinc-400 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </div>
              ) : friends.length === 0 ? (
                <p className="col-span-6 text-center text-sm text-zinc-400">
                  No friends available to invite.
                </p>
              ) : (
                friends.map((friend, idx) => (
                  <div
                    key={friend._id}
                    onClick={() => toggleFriendSelection(friend._id)}
                    className={`flex flex-col items-center cursor-pointer p-2 transition min-h-[100px] ${
                      selectedFriends.includes(friend._id)
                        ? "border-2 border-blue-200 rounded-xl"
                        : "rounded-xl"
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={friend.profilePic || "/avatar.png"}
                        alt={friend.fullName}
                        className="size-12 rounded-full object-cover border border-base-300"
                      />
                      {onlineUsers.includes(friend._id) && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                      )}
                    </div>
                    <p className="text-xs mt-1 text-center">
                      {friend.fullName}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="btn btn-sm btn-outline btn-info"
                onClick={() => handleInviteFriends()}
                disabled={selectedFriends.length === 0}
              >
                Invite
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default InviteFriendsToGroup;
