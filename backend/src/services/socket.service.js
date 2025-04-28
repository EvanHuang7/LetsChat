import { io, getSocketIdByUserId } from "../lib/socket.js";

// The service function to emit new message event
export const emitNewMessageEventService = async ({
  userIds,
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
