import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

// The service function to get all users for a sidebar
export const getUsersForSidebarService = async ({ loggedInUserId }) => {
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
    }).select("-password");

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

// The service function to get all messages for a conversation
export const getMessagesService = async ({ conversationId }) => {
  try {
    // Validate if the conversationId exists
    if (!conversationId) {
      return {
        messages: null,
        error: "ConversationId is required",
      };
    }

    // Run query to get all messages
    const messages = await Message.find({ conversationId: conversationId });

    return { messages: messages, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      messages: null,
      error:
        error.message ||
        "An error occurred while getting messages for conversation",
    };
  }
};

// The service function to create a message in a conversation
export const createMessageService = async ({
  conversationId,
  senderId,
  sequence,
  text,
  image,
}) => {
  try {
    // Validate text and image
    if (!text && !image) {
      return {
        newMessage: null,
        error: "At least provide text or image",
      };
    }

    // Upload image if there is one
    let imageUrl;
    if (image) {
      // Check if the image is already a Cloudinary hosted URL
      const isCloudinaryUrl = image.startsWith("https://res.cloudinary.com/");

      // Use existing URL directly to avoid uploading again for saving space
      if (isCloudinaryUrl) {
        imageUrl = image;
      } else {
        // Upload base64 image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image);
        imageUrl = uploadResult.secure_url;
      }
    }

    // Create this new message
    const newMessage = new Message({
      conversationId,
      // We shorten "senderId: senderId" to senderId
      senderId,
      sequence,
      text,
      image: imageUrl,
    });
    // Save this new message to database
    await newMessage.save();

    return { newMessage: newMessage, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      newMessage: null,
      error:
        error.message ||
        "An error occurred while sending a message in conversation",
    };
  }
};
