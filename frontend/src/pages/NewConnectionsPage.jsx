import { useEffect } from "react";
import { useConnectionStore } from "../store/useConnectionStore";
import ConnectionCard from "../components/connections/ConnectionCard";

const NewConnectionsPage = () => {
  const {
    getConnections,
    isConnectionsLoading,
    pendingConnections,
    respondedConnections,
  } = useConnectionStore();

  useEffect(() => {
    getConnections();
  }, [getConnections]);

  const pendingConns = pendingConnections();
  const respondedConns = respondedConnections();

  return (
    <div className="h-screen pt-20">
      <div className="max-w-3xl mx-auto p-4 py-8">
        <div className="bg-base-100 rounded-xl p-6 space-y-10">
          {/* Pending Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              New Connections & Invites
            </h2>
            {isConnectionsLoading ? (
              <p>Loading...</p>
            ) : pendingConns.length === 0 ? (
              <p className="text-sm text-base-content/60">
                No new connections.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingConns.map((pendingConn) => (
                  <ConnectionCard
                    key={pendingConn._id}
                    connection={pendingConn}
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
            {respondedConns.length === 0 ? (
              <p className="text-sm text-base-content/60">
                No responses recorded yet.
              </p>
            ) : (
              <div className="space-y-4">
                {respondedConns.map((respondedConn) => (
                  <ConnectionCard
                    key={respondedConn._id}
                    connection={respondedConn}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default NewConnectionsPage;
