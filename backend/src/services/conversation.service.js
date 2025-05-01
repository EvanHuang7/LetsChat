import Conversation from "../models/conversation.model.js";
import cloudinary from "../lib/cloudinary.js";
import {
  createConvoInfoOfUserService,
  getConvoInfoOfUserbyIdsService,
} from "../services/convoInfoOfUser.service.js";

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
  groupCreaterId = "",
  groupName = "",
}) => {
  try {
    // Check the inputs
    if (!isGroup && userIds.length !== 2) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "Private conversation should have two users",
      };
    }
    if (isGroup && userIds.length < 1) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "Group conversation must have at least 1 user",
      };
    }
    if (isGroup && !groupCreaterId) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "GroupCreaterId is required for group conversation",
      };
    }

    // Create the new conversation and save it to the database
    const newConversation = isGroup
      ? new Conversation({
          userIds,
          isGroup,
          groupCreaterId,
          groupName,
        })
      : new Conversation({
          userIds,
          isGroup,
        });
    await newConversation.save();

    let convoInfoOfUser;
    // Create convoInfoOfUser records for all userIds
    // If there are more than 1 userIds in conversation
    // This is create friend conversation case now, so return the
    // connection sender's convoInfo for socket to emit it
    if (userIds.length > 1) {
      for (const userId of userIds) {
        const { convoInfoOfUser: singleConvoInfoOfUser, error } =
          await createConvoInfoOfUserService({
            userId,
            conversationId: newConversation._id,
          });
        if (error) {
          return {
            conversation: null,
            convoInfoOfUser: null,
            error,
          };
        }

        // Return the connection sender convoInfo, sender is hard coded
        // to first element in updateConnectionStatusService()
        if (userId === userIds[0]) {
          convoInfoOfUser = singleConvoInfoOfUser;
        }
      }

      // If there is only 1 userId in conversation, await and return it
      // This is for creat group conversation in front-end case, so
      // return the group creator's convoInfoOfUser to api
    } else {
      const { convoInfoOfUser: singleConvoInfoOfUser, error } =
        await createConvoInfoOfUserService({
          userId: userIds[0],
          conversationId: newConversation._id,
        });
      if (error) {
        return {
          conversation: null,
          convoInfoOfUser: null,
          error,
        };
      }

      convoInfoOfUser = singleConvoInfoOfUser;
    }

    // Get hydrated new conversation with user information before returning it
    const hydratedConversation = await Conversation.findById(
      newConversation._id
    ).populate("userIds", "fullName profilePic");

    // Return the hydrated conversation
    return {
      conversation: hydratedConversation,
      convoInfoOfUser: convoInfoOfUser,
      error: null,
    };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      convoInfoOfUser: null,
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
  addNewUser = false,
  groupName,
  groupImage,
}) => {
  try {
    let createConvoInfoOfUserRecord = false;

    // Validate input
    if (!conversationId) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "ConversationId is required",
      };
    }

    if (addNewUser && !userId) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "UserId is required when adding a neewe user",
      };
    }

    if (!addNewUser && !groupName && !groupImage) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error:
          "GroupName, or groupImage is required when not adding a new user",
      };
    }

    // Find existing conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error: "Conversation not found",
      };
    }

    // Return error if existing conversation is private
    if (!conversation.isGroup) {
      return {
        conversation: null,
        convoInfoOfUser: null,
        error:
          "Cannot update private conversation for group data field (userId, groupName, or groupImage)",
      };
    }

    // Handle adding user
    if (addNewUser && userId) {
      if (conversation.userIds.length >= 100) {
        return {
          conversation: null,
          convoInfoOfUser: null,
          error: "Cannot add more than 100 users to a group",
        };
      }

      // Only add user if not already exists
      if (!conversation.userIds.includes(userId)) {
        conversation.userIds.addToSet(userId); // Mongoose array method
        createConvoInfoOfUserRecord = true;
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

    let convoInfoOfUser;
    // Create convoInfoOfUser record for userId and return it for socket
    // to emit to all group memebers if adding a new user to userIds
    // list in group conversation, called by back-end
    if (addNewUser && createConvoInfoOfUserRecord) {
      const { convoInfoOfUser: singleConvoInfoOfUser, error } =
        await createConvoInfoOfUserService({
          userId,
          conversationId: updatedConversation._id,
        });
      if (error) {
        return {
          conversation: null,
          convoInfoOfUser: null,
          error,
        };
      }

      convoInfoOfUser = singleConvoInfoOfUser;
    }

    // Await to get updated convoInfoOfUser and return logged in user's
    // convoInfo to front-end if update group name or img, called by front-end
    if (!addNewUser) {
      const { convoInfoOfUser: singleConvoInfoOfUser, error } =
        await getConvoInfoOfUserbyIdsService({
          userId: userId,
          conversationId: updatedConversation._id,
        });
      if (error) {
        return {
          conversation: null,
          convoInfoOfUser: null,
          error,
        };
      }

      convoInfoOfUser = singleConvoInfoOfUser;
    }

    return {
      conversation: updatedConversation,
      convoInfoOfUser: convoInfoOfUser,
      error: null,
    };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      conversation: null,
      convoInfoOfUser: null,
      error:
        error.message || "An error occurred while updating group conversation",
    };
  }
};
