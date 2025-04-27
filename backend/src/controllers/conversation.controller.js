import {
  getConversationService,
  getConversationByUserIdsService,
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
    const { conversation, error } = await getConversationService({
      conversationId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in getConversation controller", error.message);
    return res.status(500).json({
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

    // Try to get an existing conversation first
    const { conversation: existingConversation, error: getError } =
      await getConversationByUserIdsService({
        userIds,
        isGroup,
      });
    if (getError) {
      return res.status(400).json({
        message: getError,
      });
    }

    // Return the existing conversation if there is one
    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    // If no existing conversation, create one
    const { conversation: newConversation, error: createError } =
      await createConversationService({
        userIds,
        isGroup,
        groupName,
      });
    if (createError) {
      return res.status(400).json({
        message: createError,
      });
    }

    // Return the created conversation
    return res.status(201).json(newConversation);
  } catch (error) {
    console.log("Error in createConversation controller", error.message);
    return res.status(500).json({
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
    const { conversation, error } =
      await increaselatestSentMessageSequenceService({
        conversationId,
      });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.log(
      "Error in increaselatestSentMessageSequence controller",
      error.message
    );
    return res.status(500).json({
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
    const { conversation, error } = await updateGroupConversationService({
      conversationId,
      userId,
      groupName,
      groupImage,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in updateGroupConversation controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
