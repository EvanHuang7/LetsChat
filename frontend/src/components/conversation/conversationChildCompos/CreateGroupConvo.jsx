import React, { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../../../store/useAuthStore";
import { useConversationStore } from "../../../store/useConversationStore";

const CreateGroupConvo = () => {
  const { authUser } = useAuthStore();
  const { createConversation } = useConversationStore();

  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");

  const createGroupConversation = (groupName) => {
    // Check input
    if (!groupName) {
      console.log("Function errored because groupName is required");
      toast.error("Please enter a group name");
      return;
    }
    // Call createConversation api function
    createConversation({
      userIds: [authUser._id],
      isGroup: true,
      groupName: groupName,
    });

    // Close modal
    setShowCreateGroupModal(false);
  };

  return (
    <div>
      <div className="text-sm text-center text-base-content/60">
        <span>
          Start a conversation by{" "}
          <a href="/newconnections" className="underline">
            connecting a new friend
          </a>{" "}
          or{" "}
          <button
            className="btn btn-xs rounded-full animate-pulse"
            onClick={(e) => {
              e.stopPropagation();
              setShowCreateGroupModal(true);
            }}
          >
            <MessageSquarePlus className="size-3" />
            <span className="text-base-content/80">Create a group</span>
          </button>{" "}
          and invite your friend to group!
        </span>
      </div>

      {/* Create group conversation modal */}
      <dialog
        id="create_group_conversation_modal"
        className="modal"
        open={showCreateGroupModal}
      >
        <div
          className="modal-box max-w-xs sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg">Create a group conversation</h3>

          {/* Group name input */}
          <input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input input-bordered w-full mt-4"
          />

          {/* Modal buttons */}
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setGroupName(""); // reset input after cancel
                  setShowCreateGroupModal(false);
                }}
                className="btn btn-sm bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  createGroupConversation(groupName);
                  setGroupName(""); // reset input after create
                }}
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CreateGroupConvo;
