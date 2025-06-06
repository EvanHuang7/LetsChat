import {
  createConnectionService,
  getConnectionsService,
  getUsersForConnPageService,
  getAllFriendConnectionsService,
  getSpecifiedConnectionService,
  setRejectedConnectionToPendingService,
  updateConnectionStatusService,
  getAllAcceptedFriendConnectionsService,
  getAllGroupInvitationForUserIdsService,
  resetBatchRejectedGroupInvitaionToPendingService,
  sendBatchGroupInvitationService,
  getConnectionsByIdsAndEmitEvent,
} from "../services/connection.service.js";
import { getConversationService } from "../services/conversation.service.js";
import {
  emitNewAcceptedFriendEventService,
  emitNewGroupMemberEventService,
} from "../services/socket.service.js";

// Get all connection records (friends and groups)
// for logged in user as receiver.
// FRONT-END USAGE: display all connections data for logged in user
// in New connection page.
// BACK-END USAGE:
export const getConnections = async (req, res) => {
  try {
    // Get current logged in userId as receiverId
    const loggedInUserId = req.user._id;

    // Call the service function to get all populated info connections
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
// FRONT-END USAGE: Display all app users in new connection page
// BACK-END USAGE:
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

// Send a new friend connection or group invite from logged in user.
// FRONT-END USAGE: send out a friend connection request in all users section.
// BACK-END USAGE:
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

        const { hydratedConnections, error: getAndEmitError } =
          await getConnectionsByIdsAndEmitEvent({
            connectionIds: [updatedConnection._id],
          });
        if (getAndEmitError) {
          return res.status(400).json({
            message: getAndEmitError,
          });
        }

        return res.status(200).json(hydratedConnections[0]);
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

    // Get new connection with populdated sender info and group conversation name
    // Get all populdated connections and emit event to connection receiver
    const { hydratedConnections, error: getAndEmitError } =
      await getConnectionsByIdsAndEmitEvent({
        connectionIds: [newConnection._id],
      });
    if (getAndEmitError) {
      return res.status(400).json({
        message: getAndEmitError,
      });
    }

    return res.status(201).json(hydratedConnections[0]);
  } catch (error) {
    console.log("Error in sendConnection controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get all friend users or filtered friend users for logged in user
// FRONT-END USAGE: Display friend users to invite them into a group
// BACK-END USAGE:
export const getAllFriendUsers = async (req, res) => {
  try {
    const { filterUsersFromConvo, groupConversationId } = req.body;
    const loggedInUserId = req.user._id;

    // Valid input
    if (filterUsersFromConvo && !groupConversationId) {
      return res.status(400).json({
        message:
          "GroupConversationId is required to get all frined users filtered by conversation group members",
      });
    }

    // Fetch accepted friend connections
    const { connections, error: getUsersError } =
      await getAllAcceptedFriendConnectionsService({ loggedInUserId });
    if (getUsersError) {
      return res.status(400).json({ message: getUsersError });
    }

    // Extract all friend users (excluding the logged-in user)
    const allFriendUsers = [];
    connections.forEach((conn) => {
      if (conn.senderId._id.toString() !== loggedInUserId.toString()) {
        allFriendUsers.push(conn.senderId);
      }
      if (conn.receiverId._id.toString() !== loggedInUserId.toString()) {
        allFriendUsers.push(conn.receiverId);
      }
    });

    // If not filtering, return the raw result
    if (!filterUsersFromConvo) {
      return res.status(200).json(allFriendUsers);
    }

    // Filter out users already in the conversation
    const { conversation, error: getConversationError } =
      await getConversationService({ conversationId: groupConversationId });
    if (getConversationError) {
      return res.status(400).json({ message: getConversationError });
    }

    const userIdsInConversation = new Set(
      conversation.userIds.map((user) => user._id.toString())
    );

    const filteredUsers = allFriendUsers.filter(
      (user) => !userIdsInConversation.has(user._id.toString())
    );

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllFriendUsers controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Send a batch of group invitations to a user list
// FRONT-END USAGE: Invite a list of friends to join a group
// BACK-END USAGE:
export const sendBatchGroupInvitation = async (req, res) => {
  try {
    // Get selectedUserIds, groupConversationId from reqest body
    const { selectedUserIds, groupConversationId } = req.body;
    // Get current logged in userId as loggedInUserId
    const loggedInUserId = req.user._id;

    // Try to fetch any existing group invitations first
    const { connections: existingConnections, error: getError } =
      await getAllGroupInvitationForUserIdsService({
        loggedInUserId,
        selectedUserIds,
        groupConversationId,
      });
    if (getError) {
      return res.status(400).json({
        message: getError,
        connection: existingConnections,
      });
    }

    // Categorize users
    const alreadyInvitedUserIds = new Set();
    const rejectedConnections = [];

    for (const conn of existingConnections) {
      alreadyInvitedUserIds.add(conn.receiverId.toString());

      if (conn.status === "rejected") {
        rejectedConnections.push(conn);
      }
    }

    let updatedConnections = [];
    // Set rejected connections to pending status
    if (rejectedConnections.length > 0) {
      const { connections, error: setExistingError } =
        await resetBatchRejectedGroupInvitaionToPendingService({
          rejectedConnections,
        });
      if (setExistingError) {
        return res.status(400).json({
          message: setExistingError,
        });
      }

      updatedConnections = connections;
    }

    // Filter new users to invite (not in existingConnections)
    const newUserIdsToInvite = selectedUserIds.filter(
      (id) => !alreadyInvitedUserIds.has(id)
    );

    let createdConnections = [];
    // Send batch of group invitations
    if (newUserIdsToInvite.length > 0) {
      const { newConnections, error: createError } =
        await sendBatchGroupInvitationService({
          loggedInUserId,
          userIds: newUserIdsToInvite,
          groupConversationId,
        });
      if (createError) {
        return res.status(400).json({
          message: createError,
        });
      }

      createdConnections = newConnections;
    }

    // Get all Ids of allConnections
    const allConnections = [...updatedConnections, ...createdConnections];
    const allConnectionIds = [];
    for (const conn of allConnections) {
      allConnectionIds.push(conn._id.toString());
    }

    // If no updatedConnections and createdConnections at all,
    // skip getting populdated connections for emiting event
    if (allConnectionIds.length === 0) {
      return res
        .status(200)
        .json({ message: "All Group invitations are pending states" });
    }

    // Get all populdated connections and emit event to connection receiver
    const { hydratedConnections, error } =
      await getConnectionsByIdsAndEmitEvent({
        connectionIds: allConnectionIds,
      });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(201).json(hydratedConnections);
  } catch (error) {
    console.log("Error in sendBatchGroupInvitation controller", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update (accept or reject) a connection status for logged in user.
// FRONT-END USAGE: Accept or reject a connection in new connection page.
// BACK-END USAGE:
export const updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId, status } = req.body;

    const { updatedConnection, convoInfoOfUser, error } =
      await updateConnectionStatusService({
        connectionId,
        status,
      });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    // Only event when friend connection or group invitation accepted
    if (updatedConnection.status === "accepted") {
      if (updatedConnection.type === "friend") {
        // Emit the new connection sender convoInfoOfUser if friend
        // conversation is accepted
        const { error: emitEventError } =
          await emitNewAcceptedFriendEventService({
            connectionSenderId: updatedConnection.senderId._id,
            newConvoInfoOfUser: convoInfoOfUser,
          });
        if (emitEventError) {
          return res.status(400).json({
            message: emitEventError,
          });
        }
      } else {
        // Emit new group member created convoInfoOfUser to all oneline group members
        const { error: emitEventError } = await emitNewGroupMemberEventService({
          userIds: convoInfoOfUser.conversationId.userIds,
          newGroupMemberId: convoInfoOfUser.userId,
          newConvoInfoOfUser: convoInfoOfUser,
        });
        if (emitEventError) {
          return res.status(400).json({
            message: emitEventError,
          });
        }
      }
    }

    return res.status(200).json({ updatedConnection, convoInfoOfUser });
  } catch (error) {
    console.log("Error in updateConnectionStatus controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get specified connections between logged in user
// and selected user.
// FRONT-END USAGE:
// BACK-END USAGE:
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
