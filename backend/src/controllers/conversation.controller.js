import User from "../models/user.model.js";
import Moment from "../models/moment.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";
import Conversation from "../models/conversation.model.js";

// Get a conversation with conversationId in url param
// USAGE: Display a conversation in chat container
export const getConversation = async (req, res) => {
  try {
    // Get conversationId from reqest body
    const { conversationId } = req.body;

    const conversation = await Conversation.findById(conversationId).populate(
      "userIds",
      "fullName profilePic"
    ); // Populate users info

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

    // Check the inputs from request body
    if (!isGroup && userIds.length !== 2) {
      return res.status(400).json({
        message: "Private conversation should have two users",
      });
    }
    if (isGroup && userIds.length >= 1) {
      return res.status(400).json({
        message: "Group conversation at least has 1 user",
      });
    }

    // Create this new conversation
    const newConversation = new Conversation({
      userIds,
      isGroup,
      groupName,
    });
    // Save this new conversation to database
    await newConversation.save();

    // Get hydrated new conversation with user information beofre return it
    const Hydratedconversation = await Conversation.findById(
      newConversation._id
    ).populate("userIds", "fullName profilePic"); // Populate users info

    res.status(201).json(Hydratedconversation);
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

    // Check the inputs from request body
    if (!conversationId) {
      return res.status(400).json({
        message: "ConversationId is required",
      });
    }

    // Run query to increase latestSentMessageSequence
    const updatedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $inc: { latestSentMessageSequence: 1 } },
      { new: true }
    ).populate("userIds", "fullName profilePic"); // Populate users info;

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

    // Check the inputs from request body
    if (!conversationId) {
      return res.status(400).json({
        message: "ConversationId is required",
      });
    }

    if (!userId && !groupName && !groupImage) {
      return res.status(400).json({
        message: "At least one group data field required",
      });
    }

    // Find existing conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    // Handle adding user
    if (userId) {
      if (conversation.userIds.length >= 100) {
        return res.status(400).json({
          message: "Cannot add more than 100 users to a group",
        });
      }

      // Only add user if not already exists
      if (!conversation.userIds.includes(userId)) {
        conversation.userIds.addToSet(userId); // Mongoose array method
      }
    }

    // Handle updating group name
    if (groupName) {
      conversation.groupName = groupName;
    }

    // Handle updating group image
    if (groupImage) {
      const uploadResult = await cloudinary.uploader.upload(groupImage);
      conversation.groupPictureUrl = uploadResult.secure_url;
    }

    // Save updated conversation
    const updatedConversation = await conversation.save();

    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log("Error in updateGroupConversation controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
