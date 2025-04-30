import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Upload, Ellipsis, UserPlus, Save } from "lucide-react";

import { useConversationStore } from "../../../store/useConversationStore";

const ConversationDetailsPanel = () => {
  const {
    selectedConversation,
    updateGroupConversation,
    isGroupImgUploading,
    isEditingGroupName,
    setIsEditingGroupName,
  } = useConversationStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [groupName, setGroupName] = useState("");

  if (!selectedConversation?.isGroup) return null;

  const users = selectedConversation.userIds || [];
  const MAX_DISPLAY = 2;
  const displayUsers = users.slice(0, MAX_DISPLAY);
  const hasMoreUsers = users.length > MAX_DISPLAY;

  useEffect(() => {
    // Call functions
    if (selectedConversation.isGroup) {
      setGroupName(selectedConversation.groupName);
    }

    // Effect will only activate if the values in the list change.
  }, [selectedConversation._id, setGroupName]);

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
            />
            {isEditingGroupName && (
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
          <div className="flex items-center flex-wrap gap-2">
            {displayUsers.map((user) => (
              <div key={user._id} className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-15 object-cover rounded-full border border-base-300"
                />
              </div>
            ))}
            {hasMoreUsers && (
              <button
                className="size-15 rounded-full border border-base-300 flex items-center justify-center
                  bg-base-200 hover:bg-base-300 transition"
                title="Show all members"
              >
                <Ellipsis className="w-4 h-4 text-base-content" />
              </button>
            )}
          </div>
        </div>

        {/* Other Actions */}
        <div className="space-y-3">
          {/* You may remove this if you use the input+icon only */}
          <button className="btn btn-sm w-full">
            <UserPlus className="size-4" />
            Invite friends
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ConversationDetailsPanel;
