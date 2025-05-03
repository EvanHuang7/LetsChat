import { useEffect } from "react";

import MomentSkeleton from "../skeletons/MomentSkeleton";
import ConnectionCard from "./connectionChildCompos/ConnectionCard";
import UserCard from "./connectionChildCompos/UserCard";

import { useConnectionStore } from "../../store/useConnectionStore";

const ConnectionsContainer = () => {
  const {
    users,
    getUsersForConnection,
    getConnections,
    isConnectionsLoading,
    pendingConnections,
    respondedConnections,
  } = useConnectionStore();

  useEffect(() => {
    getConnections();
    getUsersForConnection();
  }, [getConnections, getUsersForConnection]);

  return (
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
          <p className="text-sm text-base-content/60">No new connections.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ConnectionsContainer;
