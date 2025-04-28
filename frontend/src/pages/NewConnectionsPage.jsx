import { useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, NotebookText, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useConnectionStore } from "../store/useConnectionStore";
import ConnectionCard from "../components/connections/ConnectionCard";
import MomentSkeleton from "../components/skeletons/MomentSkeleton";

const NewConnectionsPage = () => {
  const {
    users,
    getUsersForConnection,
    getConnections,
    isConnectionsLoading,
    pendingConnections,
    respondedConnections,
  } = useConnectionStore();
  const { sendConnection } = useConnectionStore();
  // TODO: get users info from store and update get all users api to return
  // intro/job/email and connectionStatus

  useEffect(() => {
    getConnections();
    getUsersForConnection();
  }, [getConnections, getUsersForConnection]);

  const renderConnectButton = (user) => {
    const status = user.connectionStatus;
    if (status === "accepted") {
      return (
        <button className="btn btn-xs btn-outline gap-2" disabled>
          <UserCheck className="size-4" />
          <span className="hidden sm:inline">Connected</span>
        </button>
      );
    }

    if (status === "pending") {
      return (
        <button className="btn btn-xs btn-outline gap-2" disabled>
          <UserPlus className="size-4" />
          <span className="hidden sm:inline">Pending</span>
        </button>
      );
    }

    // default for "" and "rejected"
    return (
      <button
        onClick={() => handleSendConnection(user._id)}
        className="btn btn-xs btn-outline gap-2"
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
      // Keep groupName field to always to NULL instead of empty string
      // for friend type connection. If using empty string, the back-end
      // query can not find exisitng connections with filter properly
      groupName: null,
      // TODO: update it after adding a send greeting message composer
      message: "",
    });
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-10">
          {/* Pending Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              New Connections & Invites
            </h2>
            {/* I'm lazy to use existing MomentSkeleton */}
            {isConnectionsLoading ? (
              <div>
                <MomentSkeleton />
              </div>
            ) : pendingConnections.length === 0 ? (
              <p className="text-sm text-base-content/60">
                No new connections.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingConnections.map((pendingConnection) => (
                  <ConnectionCard
                    key={pendingConnection._id}
                    connection={pendingConnection}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Responded Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              Responded
            </h2>
            {/* I'm lazy to use existing MomentSkeleton */}
            {isConnectionsLoading ? (
              <div>
                <MomentSkeleton />
              </div>
            ) : respondedConnections.length === 0 ? (
              <p className="text-sm text-base-content/60">
                No responses recorded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {respondedConnections.map((respondedConnection) => (
                  <ConnectionCard
                    key={respondedConnection._id}
                    connection={respondedConnection}
                  />
                ))}
              </div>
            )}
          </section>
          {/* All Users Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6 text-base-content">
              All Users
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user._id} className="card bg-base-200 shadow-sm">
                  <figure className="px-10 pt-10">
                    <img
                      src={user.profilePic}
                      alt={user.fullName}
                      className="rounded-full" // <- still not round, just rounded corners
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{user.fullName}</h2>
                    <p>{user.email}</p>
                    <div className="card-actions justify-center">
                      {/* Conditionally rendered connect button */}
                      {renderConnectButton(user)}
                      {/* View moments button */}
                      <Link
                        to={`/moments/${user._id}`}
                        className="btn btn-xs btn-outline gap-2"
                      >
                        <NotebookText className="size-4" />
                        <span className="hidden sm:inline">moments</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewConnectionsPage;
