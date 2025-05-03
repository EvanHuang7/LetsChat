import React from "react";
import { Link } from "react-router-dom";
import { UserPlus, NotebookText, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useConnectionStore } from "../../../store/useConnectionStore";

const UserCard = ({ user }) => {
  const { sendConnection } = useConnectionStore();

  const renderConnectButton = (user) => {
    const status = user.connectionStatus;
    if (status === "accepted") {
      return (
        <button
          className="btn btn-xs btn-outline gap-2 w-full min-h-[30px] border-2 border-base-content/20 opacity-100 pointer-events-none"
          disabled
        >
          <UserCheck className="size-4" />
          <span className="hidden sm:inline">Connected</span>
        </button>
      );
    }

    if (status === "pending") {
      return (
        <button
          className="btn btn-xs btn-outline gap-2 w-full min-h-[30px] border-2 border-base-content/20 opacity-100 pointer-events-none"
          disabled
        >
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Pending</span>
        </button>
      );
    }

    // default for "" and "rejected"
    return (
      <button
        onClick={() => handleSendConnection(user._id)}
        className="btn btn-xs btn-outline gap-2 w-full min-h-[30px]"
      >
        <UserPlus className="size-4" />
        <span className="hidden sm:inline">Connect</span>
      </button>
    );
  };

  const handleSendConnection = (selectedUserId) => {
    // Check selectedUserId is empty or not
    if (!selectedUserId) {
      console.log("Function errored because of receving empty selectedUserId");
      toast.error("Sorry, an error occurs");
      return;
    }

    // Send a connection
    sendConnection({
      type: "friend",
      selectedUserId: selectedUserId,
      // TODO: update it after adding a send greeting message composer
      message: "",
    });
  };

  return (
    <div key={user._id} className="card bg-base-200 shadow-sm">
      <figure className="px-10 pt-10">
        <img
          src={user.profilePic || "/avatar.png"}
          alt={user.fullName}
          className="md:size-30 size-25 rounded-full object-cover"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{user.fullName}</h2>
        <div className="card-actions justify-center items-stretch gap-2">
          {/* connection status button */}
          <div className="w-[40px] sm:w-[120px]">
            {renderConnectButton(user)}
          </div>
          {/* View moments button */}
          <Link
            to={`/moments/${user._id}`}
            className="btn btn-xs btn-outline gap-2 w-[40px] sm:w-[120px] min-h-[30px] justify-center"
          >
            <NotebookText className="size-4" />
            <span className="hidden sm:inline">moments</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
