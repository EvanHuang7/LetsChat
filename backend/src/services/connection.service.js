import mongoose from "mongoose";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import {
  createConversationService,
  updateGroupConversationService,
} from "./conversation.service.js";
import { emitNewConnectionEventService } from "./socket.service.js";

// The service function to get all connections for logged in user
// as receiver to display them in the new connection page
export const getConnectionsService = async ({ loggedInUserId }) => {
  try {
    // Validate if the loggedInUserId exists
    if (!loggedInUserId) {
      return {
        connections: null,
        error: "LoggedInUserId is required",
      };
    }

    // Get all connections of receiver is logged in user
    const connections = await Connection.find({ receiverId: loggedInUserId })
      .populate("senderId", "fullName profilePic")
      .populate("groupConversationId", "groupName groupImageUrl")
      .sort({ createdAt: -1 });

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error: error.message || "An error occurred while getting connections",
    };
  }
};

// The service function to get all connections with Ids
export const getConnectionsByIdsService = async ({ connectionIds }) => {
  try {
    // Validate if the connectionIds exists
    if (!connectionIds || connectionIds.length === 0) {
      return {
        connections: null,
        error: "ConnectionIds is required",
      };
    }

    // Get all connections with populated info of by passing connectionIds
    const connections = await Connection.find({ _id: { $in: connectionIds } })
      .populate("senderId", "fullName profilePic")
      .populate("groupConversationId", "groupName groupImageUrl")
      .sort({ createdAt: -1 });

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error:
        error.message || "An error occurred while getting connection by ids",
    };
  }
};

// The service function to get all users for new connection page
export const getUsersForConnPageService = async ({ loggedInUserId }) => {
  try {
    // Validate if the loggedInUserId exists
    if (!loggedInUserId) {
      return {
        filteredUsers: null,
        error: "LoggedInUserId is required",
      };
    }

    // Get the all fields info except for password field of
    // all users that are not equal to logged in userId
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    })
      .select("-password")
      .lean();

    return { filteredUsers: filteredUsers, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      filteredUsers: null,
      error:
        error.message || "An error occurred while getting users for siderbar",
    };
  }
};

// The service function to get all friend connection WITHOUT populating
// users info for logged in user as sender or receiver
export const getAllFriendConnectionsService = async ({ loggedInUserId }) => {
  try {
    // Validate input
    if (!loggedInUserId) {
      return {
        connections: null,
        error: "LoggedInUserId is required",
      };
    }

    // Build query
    const query = {
      type: "friend",
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    };

    // Fetch any matched friend connections
    const connections = await Connection.find(query).lean();

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error:
        error.message ||
        "An error occurred while getting all friend connections service",
    };
  }
};

// The service function to get specified connections between logged in user
// and selected user
export const getSpecifiedConnectionService = async ({
  type,
  loggedInUserId,
  selectedUserId,
  groupConversationId,
}) => {
  try {
    // Validate input
    if (!type) {
      return {
        connections: null,
        error: "Type is required",
      };
    }
    if (!loggedInUserId) {
      return {
        connections: null,
        error: "LoggedInUserId is required",
      };
    }
    if (!selectedUserId) {
      return {
        connections: null,
        error: "SelectedUserId is required",
      };
    }
    if (type === "group" && !groupConversationId) {
      return {
        connections: null,
        error: "groupConversationId is required when sending a group invite",
      };
    }

    // Build query object dynamically based on type
    const query = {
      type: type,
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: loggedInUserId },
      ],
    };

    // Only pass groupConversationId into query if type === "group"
    if (type === "group") {
      query.groupConversationId = groupConversationId;
    }

    // Fetch any matched friend connection or group invitation
    const connections = await Connection.find(query);

    // Return error if more than 1 matched connections found (shouldn't happen)
    if (connections.length > 1) {
      return {
        connections: connections,
        error:
          "Sorry, error occurs beucase of more than 1 matched connections found",
      };
    }

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error:
        error.message ||
        "An error occurred while getting specified connections",
    };
  }
};

// The service function to set an rejected connection to pendding
// and update sender and receiver if needed
export const setRejectedConnectionToPendingService = async ({
  existingConnection,
  loggedInUserId,
  selectedUserId,
}) => {
  try {
    // Validate input
    if (!existingConnection) {
      return {
        connection: null,
        error: "ExistingConnection is required",
      };
    }
    if (!loggedInUserId) {
      return {
        connection: null,
        error: "LoggedInUserId is required",
      };
    }
    if (!selectedUserId) {
      return {
        connection: null,
        error: "SelectedUserId is required",
      };
    }
    if (existingConnection.status !== "rejected") {
      return {
        connection: null,
        error:
          "ExistingConnection status must be rejected, in order to setting it to pending",
      };
    }

    existingConnection.status = "pending";
    // Swape the sender and reciever if sendId is selectedUserId
    // instead of loggedInUserId
    if (
      existingConnection.senderId.equals(selectedUserId) &&
      existingConnection.receiverId.equals(loggedInUserId)
    ) {
      existingConnection.senderId = new mongoose.Types.ObjectId(loggedInUserId);
      existingConnection.receiverId = new mongoose.Types.ObjectId(
        selectedUserId
      );
    }

    // Save this updated connection to database
    await existingConnection.save();

    return { connection: existingConnection, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connection: null,
      error:
        error.message ||
        "An error occurred while setting rejected connection to pending",
    };
  }
};

// The service function to send a connection for logged in user
export const createConnectionService = async ({
  type,
  loggedInUserId,
  selectedUserId,
  groupConversationId,
  message,
}) => {
  try {
    // Validate input
    if (!type) {
      return {
        newConnection: null,
        error: "Type is required",
      };
    }
    if (!loggedInUserId) {
      return {
        newConnection: null,
        error: "LoggedInUserId is required",
      };
    }
    if (!selectedUserId) {
      return {
        newConnection: null,
        error: "SelectedUserId is required",
      };
    }
    if (type === "group" && !groupConversationId) {
      return {
        newConnection: null,
        error: "groupConversationId is required when sending a group invite",
      };
    }

    // Create the new connection and save it to the database
    const newConnection = new Connection({
      // We shorten "type: type" to type
      type,
      status: "pending",
      senderId: loggedInUserId,
      receiverId: selectedUserId,
      groupConversationId: groupConversationId,
      message,
    });
    // Save this new connection to database
    await newConnection.save();

    return { newConnection: newConnection, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      newConnection: null,
      error: error.message || "An error occurred while creating connection",
    };
  }
};

// The service function to get all ACCEPTED friend connections WITH
// poplulating users info for logged in user as sender or receiver
export const getAllAcceptedFriendConnectionsService = async ({
  loggedInUserId,
}) => {
  try {
    // Validate input
    if (!loggedInUserId) {
      return {
        connections: null,
        error: "LoggedInUserId is required",
      };
    }

    const query = {
      type: "friend",
      status: "accepted",
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    };

    // Fetch any matched friend connections
    const connections = await Connection.find(query)
      .populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic")
      .lean();

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error:
        error.message ||
        "An error occurred while getting all accepted friend connections service",
    };
  }
};

// The service function to get all group invitation sent by logged in user
// and received by selectedUserIds in a group Conversation
export const getAllGroupInvitationForUserIdsService = async ({
  loggedInUserId,
  selectedUserIds,
  groupConversationId,
}) => {
  try {
    // Validate input
    if (!loggedInUserId) {
      return {
        connections: null,
        error: "LoggedInUserId is required",
      };
    }
    if (!selectedUserIds || selectedUserIds.length < 1) {
      return {
        connections: null,
        error: "At least 1 selected user is required",
      };
    }
    if (!groupConversationId) {
      return {
        connections: null,
        error: "groupConversationId is required",
      };
    }

    // Fetch any group invitations sent by logged in user and received by
    // selectedUserIds in this group conversation
    const connections = await Connection.find({
      type: "group",
      senderId: loggedInUserId,
      receiverId: { $in: selectedUserIds },
      groupConversationId: groupConversationId,
    });

    return { connections: connections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      connections: null,
      error:
        error.message ||
        "An error occurred while getting all group invitation for userIds",
    };
  }
};

// The service function to reset a batch of rejected group invitation
// to pending status
export const resetBatchRejectedGroupInvitaionToPendingService = async ({
  rejectedConnections,
}) => {
  try {
    // Validate input
    if (!rejectedConnections || rejectedConnections.length < 1) {
      return {
        connections: null,
        error: "At least 1 rejectedConnection is required",
      };
    }

    // Update all rejectedConnections' status to "pending"
    const updatedConnections = await Promise.all(
      rejectedConnections.map(async (conn) => {
        conn.status = "pending";
        return await conn.save();
      })
    );

    return { connections: updatedConnections, error: null };
  } catch (error) {
    return {
      connections: null,
      error:
        error.message ||
        "An error occurred while setting batch rejected group invitation to pending",
    };
  }
};

// The service function to send a batch of group invitations to all
// users for a group conversation
export const sendBatchGroupInvitationService = async ({
  loggedInUserId,
  userIds,
  groupConversationId,
}) => {
  try {
    // Validate input
    if (!loggedInUserId) {
      return {
        newConnections: null,
        error: "LoggedInUserId is required",
      };
    }
    if (!userIds || userIds.length === 0) {
      return {
        newConnections: null,
        error: "At least one userId is required",
      };
    }
    if (!groupConversationId) {
      return {
        newConnections: null,
        error: "groupConversationId is required when sending a group invite",
      };
    }

    // Build connection objects
    const newConnections = userIds.map((receiverId) => ({
      type: "group",
      status: "pending",
      senderId: loggedInUserId,
      receiverId,
      groupConversationId,
    }));

    // Insert all connections into DB at once
    const insertedConnections = await Connection.insertMany(newConnections);

    return { newConnections: insertedConnections, error: null };
  } catch (error) {
    return {
      newConnections: null,
      error:
        error.message ||
        "An error occurred while sending batch group invitation",
    };
  }
};

// The service function to update a connection status for logged in user.
export const updateConnectionStatusService = async ({
  connectionId,
  status,
}) => {
  try {
    // Validate if the input exists
    if (!connectionId) {
      return {
        updatedConnection: null,
        convoInfoOfUser: null,
        error: "ConnectionId is required",
      };
    }
    if (!status) {
      return {
        updatedConnection: null,
        convoInfoOfUser: null,
        error: "Status is required",
      };
    }

    // Run query to update connection status
    const updatedConnection = await Connection.findByIdAndUpdate(
      connectionId,
      { status: status },
      { new: true }
    );

    let convoInfoOfUser;
    // If accepted, create or update conversation
    if (updatedConnection.status === "accepted") {
      // Create a private conversation
      if (updatedConnection.type === "friend") {
        const {
          conversation: newConversation,
          convoInfoOfUser: singleConvoInfoOfUser,
          error: createError,
        } = await createConversationService({
          userIds: [updatedConnection.senderId, updatedConnection.receiverId],
          isGroup: false,
        });
        if (createError) {
          return {
            updatedConnection: null,
            error: createError,
          };
        }
        convoInfoOfUser = singleConvoInfoOfUser;

        // Add receiverId to group conversation
      } else {
        const {
          conversation: updatedConversation,
          convoInfoOfUser: singleConvoInfoOfUser,
          error: updateError,
        } = await updateGroupConversationService({
          conversationId: updatedConnection.groupConversationId,
          userId: updatedConnection.receiverId,
          addNewUser: true,
        });
        if (updateError) {
          return {
            updatedConnection: null,
            error: updateError,
          };
        }
        convoInfoOfUser = singleConvoInfoOfUser;
      }
    }

    return {
      updatedConnection: updatedConnection,
      convoInfoOfUser: convoInfoOfUser,
      error: null,
    };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      updatedConnection: null,
      convoInfoOfUser: null,
      error:
        error.message || "An error occurred while updating connection status",
    };
  }
};

// Call getConnectionsByIdsService() and emitNewConnectionEventService()
export const getConnectionsByIdsAndEmitEvent = async ({ connectionIds }) => {
  try {
    // Validate if the connectionIds exists
    if (!connectionIds || connectionIds.length === 0) {
      return {
        hydratedConnections: null,
        error: "ConnectionIds is required",
      };
    }

    // Get all connections with populdated sender info and group conversation name
    const { connections: hydratedConnections, error } =
      await getConnectionsByIdsService({
        connectionIds,
      });
    if (error) {
      return {
        hydratedConnections: null,
        error: error,
      };
    }

    // Emit new connections to all oneline connectionn receiver
    const { error: emitEventError } = await emitNewConnectionEventService({
      newConnections: hydratedConnections,
    });
    if (emitEventError) {
      return {
        hydratedConnections: null,
        error: emitEventError,
      };
    }

    return { hydratedConnections, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      hydratedConnections: null,
      error:
        error.message || "An error occurred while getting connection by ids",
    };
  }
};
