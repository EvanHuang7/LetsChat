import Conversation from "../models/conversation.model.js";
import cloudinary from "../lib/cloudinary.js";

// The service function to get a conversation
export const getConversationService = async ({ conversationId }) => {
  // Validate if the conversationId exists
  if (!conversationId) {
    throw new Error("ConversationId is required");
  }

  const conversation = await Conversation.findById(conversationId).populate(
    "userIds",
    "fullName profilePic"
  ); // Populate users info

  return conversation;
};

// The service function to create a conversation
export const createConversationService = async ({
  userIds,
  isGroup,
  groupName = "",
}) => {
  // Check the inputs
  if (!isGroup && userIds.length !== 2) {
    throw new Error("Private conversation should have two users");
  }
  if (isGroup && userIds.length < 1) {
    throw new Error("Group conversation must have at least 1 user");
  }

  // Create this new conversation and save it to database
  const newConversation = new Conversation({
    userIds,
    isGroup,
    groupName,
  });
  await newConversation.save();

  // Get hydrated new conversation with user information beofre return it
  const hydratedConversation = await Conversation.findById(
    newConversation._id
  ).populate("userIds", "fullName profilePic");

  return hydratedConversation;
};

// The service function to increase latestSentMessageSequence field
export const increaselatestSentMessageSequenceService = async ({
  conversationId,
}) => {
  // Validate if the conversationId exists
  if (!conversationId) {
    throw new Error("ConversationId is required");
  }

  // Run query to increase latestSentMessageSequence
  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    { $inc: { latestSentMessageSequence: 1 } },
    { new: true }
  ).populate("userIds", "fullName profilePic"); // Populate users info;

  return updatedConversation;
};

// The service function to update a group conversation
export const updateGroupConversationService = async ({
  conversationId,
  userId,
  groupName,
  groupImage,
}) => {
  let createConversationReadsRecord = false;

  // Validate if the conversationId exists
  if (!conversationId) {
    throw new Error("ConversationId is required");
  }

  // Validate if either userId, groupName, or groupImage is provided
  if (!userId && !groupName && !groupImage) {
    throw new Error(
      "At least one group data field (userId, groupName, or groupImage) is required"
    );
  }

  // Find existing conversation
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  // Handle adding user
  if (userId) {
    if (conversation.userIds.length >= 100) {
      throw new Error("Cannot add more than 100 users to a group");
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
    conversation.groupPictureUrl = uploadResult.secure_url;
  }

  // Save updated conversation
  const updatedConversation = await conversation.save();

  if (createConversationReadsRecord) {
    // TODO: create ConversationReads entry for new userId by calling a service function
    // after ConversationReads table created
  }

  return updatedConversation;
};
