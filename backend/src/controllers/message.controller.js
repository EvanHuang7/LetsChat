import {
  getUsersForSidebarService,
  getMessagesService,
  createMessageService,
} from "../services/message.service.js";
import {
  increaselatestSentMessageSequenceService,
  updateLatestSentMessageIdService,
} from "../services/conversation.service.js";
import { emitNewMessageEventService } from "../services/socket.service.js";

// Get all users except for logged in user for side bar contact list
// USAGE: Display all app users in sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get current logged in userId
    const loggedInUserId = req.user._id;

    // Call service function to getall users
    const { filteredUsers, error } = await getUsersForSidebarService({
      loggedInUserId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get all messages for a conversation with conversationId in url param
// USAGE: Display all messages for a conversation in chat container
export const getMessages = async (req, res) => {
  try {
    // Get the conversationId from the url and rename this variable
    // from id to conversationId
    const { id: conversationId } = req.params;

    // Find all messages for the conversationId
    const { messages, error } = await getMessagesService({
      conversationId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Send a message (text or img) from logged in user
// in conversationId from url param
// USAGE: User sends a message in a conversation
export const sendMessage = async (req, res) => {
  try {
    // Get text or image from reqest body
    const { text, image } = req.body;
    // Get the conversationId from the url and rename this variable
    // from id to conversationId
    const { id: conversationId } = req.params;
    // Get current logged in userId as senderId
    const senderId = req.user._id;

    // Increasee conversation latestSentMessageSequence by 1
    const { conversation: updatedSeqConversation, error: updateSeqError } =
      await increaselatestSentMessageSequenceService({
        conversationId,
      });
    if (updateSeqError) {
      return res.status(400).json({
        message: updateSeqError,
      });
    }

    // Create new message with new sequence number from updatedSeqConversation
    const { newMessage, error: createError } = await createMessageService({
      conversationId,
      senderId,
      sequence: updatedSeqConversation.latestSentMessageSequence,
      text,
      image,
    });
    if (createError) {
      return res.status(400).json({
        message: createError,
      });
    }

    // Update conversation latestSentMessageId with new messageId
    const { conversation: updatedConversation, error: updateMessageError } =
      await updateLatestSentMessageIdService({
        conversationId,
        latestSentMessageId: newMessage._id,
      });
    if (updateMessageError) {
      return res.status(400).json({
        message: updateMessageError,
      });
    }

    // Emit newMessage to users of updatedConversation
    const { error: emitEventError } = await emitNewMessageEventService({
      userIds: updatedConversation.userIds,
      senderId,
      newMessage,
    });
    if (emitEventError) {
      return res.status(400).json({
        message: emitEventError,
      });
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
