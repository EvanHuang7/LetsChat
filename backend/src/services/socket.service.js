import { io, getSocketIdByUserId } from "../lib/socket.js";

// The service function to emit new message event to all oneline users
// of conversation users list
export const emitNewMessageEventService = async ({
  // it's a populated objects array when passed in
  userIds,
  // it's a id string when passed in
  senderId,
  newMessage,
}) => {
  try {
    // Validate if the input
    if (userIds.length < 1) {
      return {
        error: "UserIds is required",
      };
    }

    if (!senderId) {
      return {
        error: "SenderId is required",
      };
    }

    if (!newMessage) {
      return {
        error: "NewMessage is required",
      };
    }

    // Get all users except sender and emit newMessage to all their sockets if online
    const promises = userIds
      .filter((user) => user._id.toString() !== senderId.toString())
      .map((user) => {
        const receiverSocketId = getSocketIdByUserId(user._id);
        if (receiverSocketId) {
          return io.to(receiverSocketId).emit("newMessage", newMessage);
        }
      });

    // Emit events at once
    await Promise.all(promises);

    return { error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      error:
        error.message || "An error occurred while emiting new message event",
    };
  }
};

// The service function to emit new accepted friend event to connection
// sender if he/she is online
// No need to emit to connection receiver because he/she has to
// change the page with back-end data loaded to view new conversation.
export const emitNewAcceptedFriendEventService = async ({
  // it's a id string when passed in
  connectionSenderId,
  newConvoInfoOfUser,
}) => {
  try {
    // Validate if the input
    if (!connectionSenderId) {
      return {
        error: "ConnectionSenderId is required",
      };
    }

    if (!newConvoInfoOfUser) {
      return {
        error: "newConvoInfoOfUser is required",
      };
    }

    const connectionSenderSocketId = getSocketIdByUserId(connectionSenderId);
    if (connectionSenderSocketId) {
      io.to(connectionSenderSocketId).emit(
        "newAcceptedFriend",
        newConvoInfoOfUser
      );
    }

    return { error: null };
  } catch (error) {
    return {
      error:
        error.message ||
        "An error occurred while emiting new accepted friend event",
    };
  }
};

// The service function to emit new group member event to all existing
// online group members
export const emitNewGroupMemberEventService = async ({
  // it's a populated objects array when passed in
  userIds,
  // it's a id string when passed in
  newGroupMemberId,
  newConvoInfoOfUser,
}) => {
  try {
    // Validate if the input
    if (userIds.length < 1) {
      return {
        error: "UserIds is required",
      };
    }

    if (!newGroupMemberId) {
      return {
        error: "newGroupMemberId is required",
      };
    }

    if (!newConvoInfoOfUser) {
      return {
        error: "newConvoInfoOfUser is required",
      };
    }

    // Get all users except new group member and emit newGroupMember event
    // to all their sockets if online
    const promises = userIds
      .filter((user) => user._id.toString() !== newGroupMemberId.toString())
      .map((user) => {
        const receiverSocketId = getSocketIdByUserId(user._id);
        if (receiverSocketId) {
          return io
            .to(receiverSocketId)
            .emit("newGroupMember", newConvoInfoOfUser);
        }
      });

    // Emit events at once
    await Promise.all(promises);

    return { error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      error:
        error.message ||
        "An error occurred while emiting new group member event",
    };
  }
};

// The service function to emit new connection event to each online
// connection receiver (including friend connection and group invitation)
export const emitNewConnectionEventService = async ({
  // it's a populated objects array when passed in
  newConnections,
}) => {
  try {
    // Validate if the input
    if (!newConnections || newConnections.length === 0) {
      return {
        error: "NewConnections are required",
      };
    }

    // Get each connection reciever and emit newConnection event
    // to all their sockets if online
    const promises = newConnections.map((newConnection) => {
      const receiverSocketId = getSocketIdByUserId(newConnection.receiverId);
      if (receiverSocketId) {
        return io.to(receiverSocketId).emit("newConnection", newConnection);
      }
    });

    // Emit events at once
    await Promise.all(promises);

    return { error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      error:
        error.message || "An error occurred while emiting new connection event",
    };
  }
};
