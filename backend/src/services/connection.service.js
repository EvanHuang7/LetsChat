import mongoose from "mongoose";
import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import {
  createConversationService,
  updateGroupConversationService,
} from "./conversation.service.js";

// The service function to all connections for logged in user as receiver
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

// The service function to all friend connection for logged in user
// as sender or receiver
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
      type: type,
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

// The service function to specified connections between logged in user
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

// The service function to create a connection for logged in user
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
        error: "ConnectionId is required",
      };
    }
    if (!status) {
      return {
        updatedConnection: null,
        error: "Status is required",
      };
    }

    // Run query to update connection status
    const updatedConnection = await Connection.findByIdAndUpdate(
      connectionId,
      { status: status },
      { new: true }
    ).populate("senderId", "fullName profilePic");

    // If accepted, create or update conversation asynchronously
    // NOTE: It's best to run them in a workflow, so that it can
    // retry if any asynchronous update action fails.
    if (updatedConnection.status === "accepted") {
      // Create a private conversation
      if (updatedConnection.type === "friend") {
        createConversationService({
          userIds: [updatedConnection.senderId, updatedConnection.receiverId],
          isGroup: false,
        }).catch((err) => {
          console.error(
            "Error creating private conversation asynchronously:",
            err.message
          );
        });
        // Add receiverId to group conversation
      } else {
        updateGroupConversationService({
          conversationId: updatedConnection.groupConversationId,
          userId: updatedConnection.receiverId,
        }).catch((err) => {
          console.error(
            "Error adding logged in user to group conversation asynchronously:",
            err.message
          );
        });
      }
    }

    return { updatedConnection: updatedConnection, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      updatedConnection: null,
      error:
        error.message || "An error occurred while updating connection status",
    };
  }
};
