import React from "react";
import { UserPlus, Check, X } from "lucide-react";
import { useConnectionStore } from "../../store/useConnectionStore";

const ConnectionCard = ({ data }) => {
  const { respondToConnection } = useConnectionStore();

  const handleResponse = (accepted) => {
    respondToConnection(data._id, accepted);
  };
  const status = data.status;

  return (
    <div className="bg-base-200 p-4 rounded-xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* connection sender profile image */}
          <img
            src={data.profilePic || "/avatar.png"}
            alt={data.name}
            className="size-10 rounded-full object-cover border"
          />
          <div>
            {/* connection sender name */}
            <p className="font-semibold text-base-content">{data.name}</p>

            {/* connection type */}
            <p className="text-sm text-zinc-400">
              {data.type === "friend"
                ? "Friend Connection"
                : `Group Invite: ${data.groupName}`}
            </p>

            {/* connection greeting message */}
            {data.message && (
              <p className="text-sm text-base-content mt-1">{data.message}</p>
            )}
          </div>
        </div>

        {/* Connection action buttons or connection status */}
        <div className="flex gap-2">
          {status === "pending" ? (
            <>
              <button
                onClick={() => handleResponse(false)}
                className="btn btn-sm btn-outline btn-error"
              >
                <X size={16} />
              </button>
              <button
                onClick={() => handleResponse(true)}
                className="btn btn-sm btn-outline  btn-info"
              >
                <Check size={16} />
              </button>
            </>
          ) : (
            <span
              className={`text-sm font-medium ${
                data.status === "accepted" ? "text-green-500" : "text-red-500"
              }`}
            >
              {data.status}
            </span>
          )}
        </div>
      </div>

      {/* Connection created timestamp */}
      <div className="text-right mt-2">
        <p className="text-xs text-zinc-400">
          {new Date(data.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ConnectionCard;
