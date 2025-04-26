import Conversation from "../models/conversation.model.js";
import {
  getConversationService,
  createConversationService,
  increaselatestSentMessageSequenceService,
  updateGroupConversationService,
} from "../services/conversation.service.js";

// Get a conversation with conversationId in url param
// USAGE: Display a conversation in chat container
export const getConversation = async (req, res) => {
  try {
    // Get conversationId from url query param
    const { id: conversationId } = req.params;

    // Call the service function to get the conversation
    const conversation = await getConversationService({
      conversationId,
    });

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in getConversation controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Create a conversation with data passed in
// USAGE: Create a conversation when a friend connection accepted or
// creating a new group conversation by a logged in user
export const createConversation = async (req, res) => {
  try {
    // Get userIds, isGroup, groupName from reqest body
    const { userIds, isGroup, groupName } = req.body;

    const conversation = await createConversationService({
      userIds,
      isGroup,
      groupName,
    });

    // TODO: create ConversationReads entries for users after
    // ConversationReads table created

    res.status(201).json(conversation);
  } catch (error) {
    console.log("Error in createConversation controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Increase latestSentMessageSequence field of conversation
// USAGE: Increase "latestSentMessageSequence" when a new message sent
export const increaselatestSentMessageSequence = async (req, res) => {
  try {
    // Get conversationId from reqest body
    const { conversationId } = req.body;

    // Call the service function
    const updatedConversation = await increaselatestSentMessageSequenceService({
      conversationId,
    });

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log(
      "Error in increaselatestSentMessageSequence controller",
      error.message
    );
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update group data of conversation
// USAGE: Update "userIds" when adding new user to group or update "groupName"
// or "groupImageUrl"
export const updateGroupConversation = async (req, res) => {
  try {
    // Get userId, groupName, groupImage
    const { conversationId, userId, groupName, groupImage } = req.body;

    // Call the service function to update the conversation
    const updatedConversation = await updateGroupConversationService({
      conversationId,
      userId,
      groupName,
      groupImage,
    });

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log("Error in updateGroupConversation controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
