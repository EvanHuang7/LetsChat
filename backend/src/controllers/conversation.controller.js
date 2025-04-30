import {
  getConversationService,
  getConversationByUserIdsService,
  createConversationService,
  increaselatestSentMessageSequenceService,
  updateLatestSentMessageIdService,
  updateGroupConversationService,
} from "../services/conversation.service.js";

// Get a conversation with conversationId in url param
// FRONT-END USAGE:
// BACK-END USAGE: Call service function to get conversation users
// and filterting them out for displaying friends to invite to group
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
// FRONT-END USAGE: Only 1 place in front-end to call this API
// to create a new Group conversation by a logged in user.
// BACK-END USAGE: Call service function to create a friend
// conversation after a friend connection accepted status updated.
export const createConversation = async (req, res) => {
  try {
    // Get userIds, isGroup, groupName from reqest body
    const { userIds, isGroup, groupName } = req.body;
    // Get current logged in userId as groupCreaterId
    const groupCreaterId = isGroup ? req.user._id : "";

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
      return res.status(400).json({
        existingConversation: existingConversation,
        message: "Sorry, a conversation with same users already exist",
      });
    }

    // If no existing conversation, create one
    const {
      conversation: newConversation,
      convoInfoOfUser,
      error: createError,
    } = await createConversationService({
      userIds,
      isGroup,
      groupCreaterId,
      groupName,
    });
    if (createError) {
      return res.status(400).json({
        message: createError,
      });
    }

    // Return the created conversation and new convoInfoOfUser record
    return res.status(201).json({ newConversation, convoInfoOfUser });
  } catch (error) {
    console.log("Error in createConversation controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update some fields of conversation
// FRONT-END USAGE:
// BACK-END USAGE: Call service function to increase "latestSentMessageSequence"
// or update "latestSentMessageId" when a new message sent
export const updateConversation = async (req, res) => {
  try {
    // Get conversationId, increaselatestSentMessageSequence and
    // latestSentMessageId from reqest body
    const {
      conversationId,
      increaselatestSentMessageSequence,
      latestSentMessageId,
    } = req.body;

    let conversation = null;
    let error = null;

    // Call the increaselatestSentMessageSequence service function
    if (increaselatestSentMessageSequence) {
      const { conversation: updatedConversation, error: updateSeqError } =
        await increaselatestSentMessageSequenceService({
          conversationId,
        });
      if (updateSeqError) {
        return res.status(400).json({
          message: updateSeqError,
        });
      }

      // Save the updated conversation
      conversation = updatedConversation;
    }

    if (latestSentMessageId) {
      const { conversation: updatedConversation, error: updateMessageError } =
        await updateLatestSentMessageIdService({
          conversationId,
          latestSentMessageId,
        });
      if (updateMessageError) {
        return res.status(400).json({
          message: updateMessageError,
        });
      }

      // Save the updated conversation
      conversation = updatedConversation;
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in updateConversation controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update group data of conversation
// FRONT-END USAGE: Call this API to update "groupName" or "groupImageUrl".
// BACK-END USAGE: Call service function to add a new user to "userIds"
// list when a new user accepts a group invite.
export const updateGroupConversation = async (req, res) => {
  try {
    // Get userId, groupName, groupImage
    const { conversationId, groupName, groupImage } = req.body;
    // Get current logged in userId as userId
    const userId = req.user._id;

    // Call the service function to update the conversation
    const { conversation, convoInfoOfUser, error } =
      await updateGroupConversationService({
        conversationId,
        userId,
        addNewUser: false,
        groupName,
        groupImage,
      });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    //Return updated conversation and updated convoInfoOfUser record
    return res.status(200).json({ conversation, convoInfoOfUser });
  } catch (error) {
    console.log("Error in updateGroupConversation controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
