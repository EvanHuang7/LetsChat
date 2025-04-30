import ConvoInfoOfUser from "../models/convoInfoOfUser.model.js";

// The service function to get all conversations information for a user
export const getAllConvoInfoOfUserService = async ({ userId }) => {
  try {
    // Validate if the input exists
    if (!userId) {
      return {
        allConvoInfoOfUser: null,
        error: "UserId is required",
      };
    }

    // Run query to get all convoInfoOfUser records with hydrated info
    const allConvoInfoOfUser = await ConvoInfoOfUser.find({ userId })
      .populate({
        path: "conversationId",
        populate: [
          {
            path: "userIds", // populate userIds inside conversation
            select: "fullName profilePic",
          },
          {
            path: "latestSentMessageId", // populate latestSentMessageId inside conversation
            select: "senderId text image createdAt",
          },
        ],
      })
      .lean();

    // Find all friend type conversations, and add a "friend" object
    for (const convoInfo of allConvoInfoOfUser) {
      const conversation = convoInfo.conversationId;

      // Check if this is a friend/private conversation (not group)
      if (conversation && !conversation.isGroup) {
        // Find the other user (friend) by filtering out the logged in userId
        const friendUser = conversation.userIds.find(
          (user) => user._id.toString() !== userId.toString()
        );

        // Attach a new "friend" field into conversation object
        if (friendUser) {
          conversation.friend = {
            _id: friendUser._id,
            fullName: friendUser.fullName,
            profilePic: friendUser.profilePic,
          };
        }
      }
    }

    return { allConvoInfoOfUser: allConvoInfoOfUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      allConvoInfoOfUser: null,
      error:
        error.message || "An error occurred while getting all convoInfoOfUser",
    };
  }
};

// The service function to get a conversation information for a user
// with userId and conversationId
export const getConvoInfoOfUserbyIdsService = async ({
  userId,
  conversationId,
}) => {
  try {
    // Validate if the input exists
    if (!userId) {
      return {
        convoInfoOfUser: null,
        error: "UserId is required",
      };
    }

    if (!conversationId) {
      return {
        convoInfoOfUser: null,
        error: "ConversationId is required",
      };
    }

    // Run query to get convoInfoOfUser
    const convoInfoOfUser = await ConvoInfoOfUser.findOne({
      userId,
      conversationId,
    })
      .populate({
        path: "conversationId",
        populate: [
          {
            path: "userIds", // populate userIds inside conversation
            select: "fullName profilePic",
          },
          {
            path: "latestSentMessageId", // populate latestSentMessageId inside conversation
            select: "senderId text image createdAt",
          },
        ],
      })
      .lean();

    return { convoInfoOfUser: convoInfoOfUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      convoInfoOfUser: null,
      error:
        error.message || "An error occurred while getting the convoInfoOfUser",
    };
  }
};

// The service function to create a conversation information for a user
export const createConvoInfoOfUserService = async ({
  userId,
  conversationId,
}) => {
  try {
    // Check the inputs
    if (!userId) {
      return {
        convoInfoOfUser: null,
        error: "UserId is required",
      };
    }

    if (!conversationId) {
      return {
        convoInfoOfUser: null,
        error: "ConversationId is required",
      };
    }

    // Create the new convoInfoOfUser and save it to the database
    const newConvoInfoOfUser = new ConvoInfoOfUser({
      userId,
      conversationId,
    });
    await newConvoInfoOfUser.save();

    // Get hydrated new convoInfoOfUser with user information
    // and conversation information before returning it
    const hydratedConvoInfoOfUser = await ConvoInfoOfUser.findById(
      newConvoInfoOfUser._id
    )
      .populate({
        path: "conversationId",
        populate: [
          {
            path: "userIds", // populate userIds inside conversation
            select: "fullName profilePic",
          },
          {
            path: "latestSentMessageId", // populate latestSentMessageId inside conversation
            select: "senderId text image createdAt",
          },
        ],
      })
      .lean();

    // Return the hydrated convoInfoOfUser
    return { convoInfoOfUser: hydratedConvoInfoOfUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      convoInfoOfUser: null,
      error:
        error.message || "An error occurred while creating the convoInfoOfUser",
    };
  }
};

// The service function to update a conversation information for a user
export const updateConvoInfoOfUserService = async ({
  userId,
  conversationId,
  lastReadMessageSequence,
}) => {
  try {
    // Validate if the input exists
    if (!userId) {
      return {
        convoInfoOfUser: null,
        error: "UserId is required",
      };
    }

    if (!conversationId) {
      return {
        convoInfoOfUser: null,
        error: "ConversationId is required",
      };
    }
    // Will return error when lastReadMessageSequence is undefined or null
    if (
      lastReadMessageSequence === undefined ||
      lastReadMessageSequence === null
    ) {
      return {
        convoInfoOfUser: null,
        error: "LastReadMessageSequence is required",
      };
    }

    // Find and update convoInfoOfUser
    const updatedConvoInfoOfUser = await ConvoInfoOfUser.findOneAndUpdate(
      {
        userId,
        conversationId,
      },
      { lastReadMessageSequence: lastReadMessageSequence },
      { new: true }
    )
      .populate({
        path: "conversationId",
        populate: [
          {
            path: "userIds", // populate userIds inside conversation
            select: "fullName profilePic",
          },
          {
            path: "latestSentMessageId", // populate latestSentMessageId inside conversation
            select: "senderId text image createdAt",
          },
        ],
      })
      .lean();

    return { convoInfoOfUser: updatedConvoInfoOfUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      convoInfoOfUser: null,
      error:
        error.message || "An error occurred while updating convoInfoOfUser",
    };
  }
};
