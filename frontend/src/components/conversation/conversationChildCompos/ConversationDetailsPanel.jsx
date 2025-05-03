import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Upload,
  Ellipsis,
  UserPlus,
  Save,
  X,
  Loader2,
  Crown,
} from "lucide-react";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";
import { useConnectionStore } from "../../../store/useConnectionStore";

const ConversationDetailsPanel = () => {
  const { authUser, onlineUsers } = useAuthStore();
  const {
    selectedConversation,
    updateGroupConversation,
    isGroupImgUploading,
    isEditingGroupName,
    setIsEditingGroupName,
  } = useConversationStore();
  const {
    friends,
    isFriendsLoading,
    getAllFriendUsersExcludeGroupMemebers,
    sendBatchGroupInvitation,
  } = useConnectionStore();

  const [isGroupAdmin, setIsGroupAdmin] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [showAllMembersModal, setShowAllMembersModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const users = selectedConversation.userIds || [];
  const MAX_DISPLAY = 2;
  const displayUsers = users.slice(0, MAX_DISPLAY);
  const hasMoreUsers = users.length > MAX_DISPLAY;

  useEffect(() => {
    // Call functions
    if (selectedConversation.isGroup) {
      setGroupName(selectedConversation.groupName);
      setIsGroupAdmin(selectedConversation?.groupCreaterId === authUser._id);
    }

    // Effect will only activate if the values in the list change.
  }, [selectedConversation._id, setGroupName]);

  useEffect(() => {
    if (showInviteModal && selectedConversation._id) {
      getAllFriendUsersExcludeGroupMemebers({
        filterUsersFromConvo: true,
        groupConversationId: selectedConversation._id,
      });
    }
  }, [showInviteModal, selectedConversation._id]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("No file selected");

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return toast.error("Max file size is 2MB");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      // Call update group conversation api with base64 image data.
      // Pass true to updateGroupImage by flagging different loadings
      await updateGroupConversation(true, {
        conversationId: selectedConversation._id,
        groupImage: base64Image,
      });
    };
  };

  const handleGroupNameSave = async () => {
    // Call update group conversation api with group name.
    // Pass false to updateGroupImage by flagging different loadings
    await updateGroupConversation(false, {
      conversationId: selectedConversation._id,
      groupName: groupName,
    });
  };

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

  if (!selectedConversation?.isGroup) return null;

  return (
    <aside className="h-full w-72 border-l border-base-300 hidden lg:block overflow-auto">
      <div className="p-5 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">Group Info</h2>
          <p className="text-sm text-zinc-400">Details and actions</p>
        </div>

        {/* Group avatar upload section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={
                selectedImg ||
                selectedConversation.groupImageUrl ||
                "/groupAvatar.png"
              }
              alt="Group"
              className="size-25 rounded-full object-cover border-4"
            />
            {isGroupAdmin && (
              <label
                htmlFor="avatar-upload"
                className={`
                absolute bottom-0 right-0 
                bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer 
                transition-all duration-200
                ${
                  isGroupImgUploading ? "animate-pulse pointer-events-none" : ""
                }
              `}
              >
                <Upload className="size-3 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isGroupImgUploading}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-zinc-400">
            {isGroupImgUploading && "Uploading..."}
          </p>
        </div>

        {/* Editable Group Name */}
        <div className="space-y-1.5">
          <p className="text-sm  font-medium">Group Name</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onFocus={() => setIsEditingGroupName(true)}
              className="flex-1 px-3 py-2 bg-base-200 border border-base-300 rounded-lg text-sm"
              disabled={!isGroupAdmin}
            />
            {isGroupAdmin && isEditingGroupName && (
              <button
                onClick={handleGroupNameSave}
                className="btn btn-xs btn-outline rounded-md hover:scale-105 transition"
              >
                <Save className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Group members */}
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
    </aside>
  );
};

export default ConversationDetailsPanel;
