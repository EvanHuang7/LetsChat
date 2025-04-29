import {
  createConnectionService,
  getConnectionsService,
  getUsersForConnPageService,
  getAllFriendConnectionsService,
  getSpecifiedConnectionService,
  setRejectedConnectionToPendingService,
  updateConnectionStatusService,
} from "../services/connection.service.js";

// Get all connection records (friends and groups)
// for logged in user as receiver.
// USAGE: display the connections data for logged in user
// in New connection page.
export const getConnections = async (req, res) => {
  try {
    // Get current logged in userId as receiverId
    const loggedInUserId = req.user._id;

    // Call the service function to get all connections
    const { connections, error } = await getConnectionsService({
      loggedInUserId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getConnections controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get all users except for logged in user with connection status
// USAGE: Display all app users in new connection page
export const getUsersForConnection = async (req, res) => {
  try {
    // Get current logged in userId
    const loggedInUserId = req.user._id;

    // Call service function to get all users
    const { filteredUsers, getUsersError } = await getUsersForConnPageService({
      loggedInUserId,
    });
    if (getUsersError) {
      return res.status(400).json({
        message: getUsersError,
      });
    }

    // Call service function to get all connections
    const { connections, getConnectionsError } =
      await getAllFriendConnectionsService({
        loggedInUserId,
      });
    if (getConnectionsError) {
      return res.status(400).json({
        message: getConnectionsError,
      });
    }

    // Hydrate connection status of users
    const updatedUsers = filteredUsers.map((user) => {
      const foundConnection = connections.find(
        (conn) =>
          conn.senderId.toString() === user._id.toString() ||
          conn.receiverId.toString() === user._id.toString()
      );

      if (foundConnection) {
        return {
          ...user,
          connectionStatus: foundConnection.status, // "pending", "accepted", "rejected"
        };
      } else {
        return {
          ...user,
          connectionStatus: "", // no connection
        };
      }
    });

    return res.status(200).json(updatedUsers);
  } catch (error) {
    console.log("Error in getUsersForConnection controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get specified connections between logged in user
// and selected user.
// USAGE: display connection status between two users in Chat
// box header when selecting a user from sidebar.
export const getSpecifiedConnection = async (req, res) => {
  try {
    // Get type, selectedUserId, groupConversationId from reqest body
    const { type, selectedUserId, groupConversationId } = req.body;
    // Get current logged in userId as loggedInUserId
    const loggedInUserId = req.user._id;

    // Call the service function to get sepcified connections
    const { connections, error } = await getSpecifiedConnectionService({
      type,
      loggedInUserId,
      selectedUserId,
      groupConversationId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
        connections: connections,
      });
    }

    return res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getSpecifiedConnection controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Send a new friend connection or group invite from logged in user
// USAGE: send out a friend connection request in Chat box header.
export const sendConnection = async (req, res) => {
  try {
    // Get type, selectedUserId, groupConversationId, message from reqest body
    const { type, selectedUserId, groupConversationId, message } = req.body;
    // Get current logged in userId as loggedInUserId
    const loggedInUserId = req.user._id;

    // Try to fetch any existing friend connection or group invitation first
    const { connections: existingConnections, error: getError } =
      await getSpecifiedConnectionService({
        type,
        loggedInUserId,
        selectedUserId,
        groupConversationId,
      });
    if (getError) {
      return res.status(400).json({
        message: getError,
        connection: existingConnections,
      });
    }

    // If there is only 1 existing connection
    if (existingConnections.length === 1) {
      const existingConnection = existingConnections[0];

      // Return it directly if it's status is pending or accepted
      if (existingConnection.status !== "rejected") {
        return res.status(200).json(existingConnection);
        // Set staus to pending only if it's status is rejected
      } else {
        const { connection: updatedConnection, error: setExistingError } =
          await setRejectedConnectionToPendingService({
            existingConnection,
            loggedInUserId,
            selectedUserId,
          });
        if (setExistingError) {
          return res.status(400).json({
            message: setExistingError,
          });
        }
        return res.status(200).json(updatedConnection);
      }
    }

    // If not existing connection, create this new connection
    const { newConnection, error: createError } = await createConnectionService(
      {
        type,
        loggedInUserId,
        selectedUserId,
        groupConversationId,
      }
    );
    if (createError) {
      return res.status(400).json({
        message: createError,
      });
    }

    return res.status(201).json(newConnection);
  } catch (error) {
    console.log("Error in sendConnection controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update (accept or reject) a connection status for logged in user.
// USAGE: Accept or reject a connection in new connection page.
export const updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId, status } = req.body;

    const { updatedConnection, error } = await updateConnectionStatusService({
      connectionId,
      status,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(updatedConnection);
  } catch (error) {
    console.log("Error in updateConnectionStatus controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
