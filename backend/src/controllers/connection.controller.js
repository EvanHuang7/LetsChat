import mongoose from "mongoose";
import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import {
  createConversationService,
  updateGroupConversationService,
} from "../services/conversation.service.js";

// Get all connection records (friends and groups)
// for logged in user as receiver.
// USAGE: display the connections data for logged in user
// in New connection page.
export const getConnections = async (req, res) => {
  try {
    // Get current logged in userId as receiverId
    const loggedInUserId = req.user._id;

    // Get all connections of receiver is logged in user
    const connections = await Connection.find({ receiverId: loggedInUserId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getConnections controller", error.message);
    res.status(500).json({
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
    // Get type, selectedUserId, groupName from reqest body
    const { type, selectedUserId, groupName } = req.body;
    // Get current logged in userId as loggedInUserId
    const loggedInUserId = req.user._id;

    // Check the inputs from request body
    if (!type) {
      return res.status(400).json({
        message: "Type is required",
      });
    }
    if (!selectedUserId) {
      return res.status(400).json({
        message: "SelectedUserId is required",
      });
    }
    if (type === "group" && !groupName) {
      return res.status(400).json({
        message: "groupName is required when sending a group invite",
      });
    }

    const connections = await Connection.find({
      type: type,
      groupName: groupName,
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: loggedInUserId },
      ],
    });

    res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getConnection controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Send a new friend connection or group invite from logged in user
// USAGE: send out a friend connection request in Chat box header.
export const sendConnection = async (req, res) => {
  try {
    // Get type, selectedUserId, groupName, message from reqest body
    const { type, selectedUserId, groupName, message } = req.body;
    // Get current logged in userId as loggedInUserId
    const loggedInUserId = req.user._id;

    // Check the inputs from request body
    if (!type) {
      return res.status(400).json({
        message: "Type is required",
      });
    }
    if (!selectedUserId) {
      return res.status(400).json({
        message: "SelectedUserId is required",
      });
    }
    if (type === "group" && !groupConversationId) {
      return res.status(400).json({
        message: "groupConversationId is required when sending a group invite",
      });
    }

    // Try to fetch any exsiting friend connection or same groupConversationId
    // inviation between 2 users
    const existingConnections = await Connection.find({
      type: type,
      groupConversationId: groupConversationId,
      $or: [
        { senderId: loggedInUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: loggedInUserId },
      ],
    });

    // If there are exsiting connection between 2 users
    if (existingConnections.length > 0) {
      const existingConnection = existingConnections[0];

      // TODO: return error if there are more than 1 existingConnections
      // Theoretically it should have more than 1existingConnections

      // Change its staus to pending if it's status is rejected
      // OR return it directly if it's status is pending or accepted
      if (existingConnection.status === "rejected") {
        existingConnection.status = "pending";

        // Swape the sender and reciever if sendId is selectedUserId
        // instead of loggedInUserId
        if (
          existingConnection.senderId.equals(selectedUserId) &&
          existingConnection.receiverId.equals(loggedInUserId)
        ) {
          existingConnection.senderId = new mongoose.Types.ObjectId(
            loggedInUserId
          );
          existingConnection.receiverId = new mongoose.Types.ObjectId(
            selectedUserId
          );
        }

        // Save this updated connection to database
        await existingConnection.save();
      }
      return res.status(200).json(existingConnection);
    }

    // If not existing connection, create this new connection
    const newConnection = new Connection({
      // We shorten "type: type" to type
      type,
      status: "pending",
      senderId: loggedInUserId,
      receiverId: selectedUserId,
      groupName,
      groupConversationId: groupConversationId,
      message,
    });
    // Save this new connection to database
    await newConnection.save();

    res.status(201).json(newConnection);
  } catch (error) {
    console.log("Error in sendConnection controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update (accept or reject) a connection status for logged in user.
// USAGE: Accept or reject a connection in new connection page.
export const updateConnectionStatus = async (req, res) => {
  try {
    const { connectionId, status } = req.body;

    // Check the inputs from request body
    if (!connectionId) {
      return res.status(400).json({
        message: "ConnectionId is required",
      });
    }
    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const updatedConnection = await Connection.findByIdAndUpdate(
      connectionId,
      { status: status },
      { new: true }
    );

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

    // Hydrate updatedConnection with sender info beofre return it
    const user = await User.findById(updatedConnection.senderId).select(
      "fullName profilePic"
    );
    if (!user) {
      return res.status(404).json({
        message: "Connection updated, but sender not found",
      });
    }

    let hydratedConnection = updatedConnection.toObject();
    hydratedConnection.senderId = user;

    res.status(200).json(hydratedConnection);
  } catch (error) {
    console.log("Error in updateConnectionStatus controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
