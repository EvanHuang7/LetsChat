import React from "react";
import toast from "react-hot-toast";
import { UserPlus, Users, Check, X } from "lucide-react";

import { useConnectionStore } from "../../../store/useConnectionStore";

const ConnectionCard = ({ connection }) => {
  const status = connection.status;
  const { updateConnectionStatus } = useConnectionStore();

  const handleUpdateConnectionStatus = (event, status) => {
    // Prevent refreshing the page
    event.preventDefault();

    // Check connectionId and status
    if (!connection._id || !status) {
      console.log(
        "Function errored because either connectionId or status is empty"
      );
      toast.error("Sorry, an error occurs");
      return;
    }

    // Update Connection status
    updateConnectionStatus({
      connectionId: connection._id,
      status: status,
    });
  };

  return (
    <div key={connection._id} className="bg-base-200 p-4 rounded-xl shadow-md">
      <div className="flex items-start gap-4">
        {/* connection sender profile image */}
        <div className="flex-shrink-0">
          <img
            src={connection.senderId.profilePic || "/avatar.png"}
            alt={connection.senderId.fullName}
            className="size-10 rounded-full object-cover border"
          />
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              {/* connection sender name */}
              <p className="font-semibold text-base-content mb-1">
                {connection.senderId.fullName}
              </p>

              {/* connection type with icon */}
              <p className="text-sm text-zinc-400 flex items-start gap-1 mb-2">
                {connection.type === "friend" ? (
                  <>
                    <span className="flex-shrink-0">
                      <UserPlus size={15} />
                    </span>
                    <span className="break-words">Friend Connection</span>
                  </>
                ) : (
                  <>
                    <span className="flex-shrink-0">
                      <Users size={15} />
                    </span>
                    <span className="break-words min-w-0">
                      Group Invite from:{" "}
                      <span className="font-medium break-words">
                        {connection?.groupConversationId?.groupName}
                      </span>
                    </span>
                  </>
                )}
              </p>

              {/* connection greeting message */}
              {connection.message && (
                <p className="text-sm text-base-content mt-1">
                  {connection.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection action buttons or connection status */}
      <div className="flex gap-2 justify-end mb-2">
        {status === "pending" ? (
          <>
            <button
              onClick={(e) => handleUpdateConnectionStatus(e, "rejected")}
              className="btn btn-sm btn-outline btn-error"
            >
              <X size={15} />
            </button>
            <button
              onClick={(e) => handleUpdateConnectionStatus(e, "accepted")}
              className="btn btn-sm btn-outline btn-info"
            >
              <Check size={15} />
            </button>
          </>
        ) : (
          <span
            className={`text-sm font-medium ${
              connection.status === "accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {connection.status}
          </span>
        )}
      </div>

      {/* Connection created timestamp */}
      <div className="text-right mt-2">
        <p className="text-xs text-zinc-400">
          {new Date(connection.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ConnectionCard;
