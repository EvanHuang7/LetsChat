import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";

// Get all connection records (friends and groups)
// for logged in user as receiver
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

// Send a new friend connection or group invite from logged in user
export const sendConnection = async (req, res) => {
  try {
    // Get type, receiverId, groupName, message from reqest body
    const { type, receiverId, groupName, message } = req.body;
    // Get current logged in userId as senderId
    const senderId = req.user._id;

    // Check the inputs from request body
    if (!type) {
      return res.status(400).json({
        message: "Type is required",
      });
    }
    if (!receiverId) {
      return res.status(400).json({
        message: "ReceiverId is required",
      });
    }
    if (type === "group" && !groupName) {
      return res.status(400).json({
        message: "groupName is required when sending a group invite",
      });
    }

    // Try to fetch any exsiting friend connection or same groupId
    // inviation between this sender and receive
    const existingConnections = await Connection.find({
      type: type,
      senderId: senderId,
      receiverId: receiverId,
      groupName: groupName,
    });

    // If there are exsiting connection
    if (existingConnections.length > 0) {
      const existingConnection = existingConnections[0];

      // TODO: return error if there are more than 1 existingConnections
      // Theoretically it should have more than 1existingConnections

      // Change its staus to pending if it's status is rejected
      // OR return it directly if it's status is pending or accepted
      if (existingConnection.status === "rejected") {
        existingConnection.status = "pending";
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
      senderId,
      receiverId,
      groupName,
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

// Update (accept or reject) a connection status for logged in user
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

    // TODO: If accepted, need to create a new chat or add
    // reciever into the group after adding Chat and Group table
    // NOTE: Run it asynchronously

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

// USAGE: checkConnection api function for front-end to display
// "add user friend" button
// Get specified connections between two users
// for logged in user as connection sender
export const getConnection = async (req, res) => {
  try {
    // Get type, receiverId, groupName from reqest body
    const { type, receiverId, groupName } = req.body;
    // Get current logged in userId as senderId
    const senderId = req.user._id;

    // Check the inputs from request body
    if (!type) {
      return res.status(400).json({
        message: "Type is required",
      });
    }
    if (!receiverId) {
      return res.status(400).json({
        message: "ReceiverId is required",
      });
    }
    if (type === "group" && !groupName) {
      return res.status(400).json({
        message: "groupName is required when sending a group invite",
      });
    }

    const connections = await Connection.find({
      type: type,
      senderId: senderId,
      receiverId: receiverId,
      groupName: groupName,
    });

    res.status(200).json(connections);
  } catch (error) {
    console.log("Error in getConnection controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
