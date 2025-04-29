import { useEffect } from "react";

import ConnectionCard from "../components/connections/ConnectionCard";
import MomentSkeleton from "../components/skeletons/MomentSkeleton";
import UserCard from "../components/connections/UserCard";

import { useConnectionStore } from "../store/useConnectionStore";

const NewConnectionsPage = () => {
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
                  <ConnectionCard connection={pendingConnection} />
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
                  <ConnectionCard connection={respondedConnection} />
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
                <UserCard user={user} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewConnectionsPage;
