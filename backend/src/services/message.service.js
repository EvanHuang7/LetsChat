import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

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

// The service function to a message with populated info by id
export const getMessageByIdService = async ({ messageId }) => {
  try {
    // Validate if the messageId exists
    if (!messageId) {
      return {
        message: null,
        error: "MessageId is required",
      };
    }

    // Run query to get all messages
    // TODO: add populaet
    const message = await Message.findById(messageId);

    return { message: message, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      message: null,
      error: error.message || "An error occurred while getting messages by Id",
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
