import Conversation from "../models/conversation.model.js";
import cloudinary from "../lib/cloudinary.js";

// The service function to get a conversation
export const getConversationService = async ({ conversationId }) => {
  try {
    // Validate if the conversationId exists
    if (!conversationId) {
      return {
        conversation: null,
        error: "ConversationId is required",
      };
    }

    // Run query to get conversation
    const conversation = await Conversation.findById(conversationId).populate(
      "userIds",
      "fullName profilePic"
    ); // Populate users info

    return { conversation: conversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message || "An error occurred while getting the conversation",
    };
  }
};

// The service function to get a conversation by userIds and isGroup
export const getConversationByUserIdsService = async ({ userIds, isGroup }) => {
  try {
    // Check the inputs
    if (!isGroup && userIds.length !== 2) {
      return {
        conversation: null,
        error: "Should provide two users for private conversation",
      };
    }
    if (isGroup && userIds.length < 1) {
      return {
        conversation: null,
        error: "At least providing 1 user for group conversation",
      };
    }

    // Run query to get a conversation
    const conversation = await Conversation.findOne({
      userIds: { $all: userIds },
      $expr: { $eq: [{ $size: "$userIds" }, userIds.length] },
      isGroup,
    }).populate("userIds", "fullName profilePic");

    return { conversation: conversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message ||
        "An error occurred while getting the conversation by userIds",
    };
  }
};

// The service function to create a conversation
export const createConversationService = async ({
  userIds,
  isGroup,
  groupName = "",
}) => {
  try {
    // Check the inputs
    if (!isGroup && userIds.length !== 2) {
      return {
        conversation: null,
        error: "Private conversation should have two users",
      };
    }
    if (isGroup && userIds.length < 1) {
      return {
        conversation: null,
        error: "Group conversation must have at least 1 user",
      };
    }

    // Create the new conversation and save it to the database
    const newConversation = new Conversation({
      userIds,
      isGroup,
      groupName,
    });
    await newConversation.save();

    // Get hydrated new conversation with user information before returning it
    const hydratedConversation = await Conversation.findById(
      newConversation._id
    ).populate("userIds", "fullName profilePic");

    // Return the hydrated conversation
    return { conversation: hydratedConversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message || "An error occurred while creating the conversation",
    };
  }
};

// The service function to increase latestSentMessageSequence field
export const increaselatestSentMessageSequenceService = async ({
  conversationId,
}) => {
  try {
    // Validate if the conversationId exists
    if (!conversationId) {
      return {
        conversation: null,
        error: "ConversationId is required",
      };
    }

    // Run query to increase latestSentMessageSequence
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $inc: { latestSentMessageSequence: 1 } },
      { new: true }
    ).populate("userIds", "fullName profilePic"); // Populate users info;

    return { conversation: updatedConversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message ||
        "An error occurred while increase latest sent message sequence for conversation",
    };
  }
};

// The service function to update latestSentMessageId field
export const updateLatestSentMessageIdService = async ({
  conversationId,
  latestSentMessageId,
}) => {
  try {
    // Validate if the input exists
    if (!conversationId) {
      return {
        conversation: null,
        error: "ConversationId is required",
      };
    }

    if (!latestSentMessageId) {
      return {
        conversation: null,
        error: "LatestSentMessageId is required",
      };
    }

    // Run query to update latestSentMessageId
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { latestSentMessageId: latestSentMessageId },
      { new: true }
    ).populate("userIds", "fullName profilePic"); // Populate users info;

    return { conversation: updatedConversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message ||
        "An error occurred while updating latestSentMessageId field for conversation",
    };
  }
};

// The service function to update a group conversation
export const updateGroupConversationService = async ({
  conversationId,
  userId,
  groupName,
  groupImage,
}) => {
  try {
    let createConversationReadsRecord = false;

    // Validate if the conversationId exists
    if (!conversationId) {
      return {
        conversation: null,
        error: "ConversationId is required",
      };
    }

    // Validate if either userId, groupName, or groupImage is provided
    if (!userId && !groupName && !groupImage) {
      return {
        conversation: null,
        error:
          "At least one group data field (userId, groupName, or groupImage) is required",
      };
    }

    // Find existing conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return {
        conversation: null,
        error: "Conversation not found",
      };
    }

    // Return error if existing conversation is private
    if (!conversation.isGroup) {
      return {
        conversation: null,
        error:
          "Cannot update private conversation for group data field (userId, groupName, or groupImage)",
      };
    }

    // Handle adding user
    if (userId) {
      if (conversation.userIds.length >= 100) {
        return {
          conversation: null,
          error: "Cannot add more than 100 users to a group",
        };
      }

      // Only add user if not already exists
      if (!conversation.userIds.includes(userId)) {
        conversation.userIds.addToSet(userId); // Mongoose array method
        createConversationReadsRecord = true;
      }
    }

    // Handle updating group name
    if (groupName) {
      conversation.groupName = groupName;
    }

    // Handle updating group image
    if (groupImage) {
      const uploadResult = await cloudinary.uploader.upload(groupImage);
      conversation.groupImageUrl = uploadResult.secure_url;
    }

    // Save updated conversation
    const updatedConversation = await conversation.save();

    if (createConversationReadsRecord) {
      // TODO: create ConversationReads entry for new userId async by calling a service function
      // after ConversationReads table created
    }

    return { conversation: updatedConversation, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      error:
        error.message || "An error occurred while updating group conversation",
    };
  }
};
