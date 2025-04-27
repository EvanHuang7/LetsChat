import {
  getAllConvoInfoOfUserService,
  getConvoInfoOfUserbyIdsService,
  createConvoInfoOfUserService,
  updateConvoInfoOfUserService,
} from "../services/convoInfoOfUser.service.js";

// Get all conversation information for logged in user
// USAGE: Display all conversations when logged in user views
// friends + groups / all conversations list
export const getAllConvoInfoOfUser = async (req, res) => {
  try {
    // Get current logged in userId as userId
    const userId = req.user._id;

    // Call the service function to get all convoInfoOfUser records
    const { allConvoInfoOfUser, error } = await getAllConvoInfoOfUserService({
      userId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(allConvoInfoOfUser);
  } catch (error) {
    console.log("Error in getAllConvoInfoOfUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get a conversation information for logged in user
// with conversationId
// USAGE:
export const getConvoInfoOfUserbyIds = async (req, res) => {
  try {
    // Get  conversationId from reqest body
    const { conversationId } = req.body;

    // Get current logged in userId as userId
    const userId = req.user._id;

    // Call the service function to get the convoInfoOfUser
    const { convoInfoOfUser, error } = await getConvoInfoOfUserbyIdsService({
      userId,
      conversationId,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(convoInfoOfUser);
  } catch (error) {
    console.log("Error in getConvoInfoOfUserbyIds controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Create a conversation information for logged in user
// USAGE:
export const createConvoInfoOfUser = async (req, res) => {
  try {
    // Get conversationId from reqest body
    const { conversationId } = req.body;

    // Get current logged in userId as userId
    const userId = req.user._id;

    // Try to get an existing convoInfoOfUser first
    const { convoInfoOfUser: existingConvoInfoOfUser, error: getError } =
      await getConvoInfoOfUserbyIdsService({
        userId,
        conversationId,
      });
    if (getError) {
      return res.status(400).json({
        message: getError,
      });
    }

    // Return the existing convoInfoOfUser if there is one
    if (existingConvoInfoOfUser) {
      return res.status(200).json(existingConvoInfoOfUser);
    }

    // If no existing convoInfoOfUser, create one
    const { convoInfoOfUser: newConvoInfoOfUser, error: createError } =
      await createConvoInfoOfUserService({
        userId,
        conversationId,
      });
    if (createError) {
      return res.status(400).json({
        message: createError,
      });
    }

    // Return the created convoInfoOfUser
    return res.status(201).json(newConvoInfoOfUser);
  } catch (error) {
    console.log("Error in createConvoInfoOfUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update a conversation information for logged in user
// USAGE: Update "lastReadMessageSequence" field when a user clicks
// and views conversation
export const updateConvoInfoOfUser = async (req, res) => {
  try {
    // Get conversationId, and lastReadMessageSequence from reqest body
    const { conversationId, lastReadMessageSequence } = req.body;

    // Get current logged in userId as userId
    const userId = req.user._id;

    // Call the service function to update the convoInfoOfUser
    const { convoInfoOfUser, error } = await updateConvoInfoOfUserService({
      userId,
      conversationId,
      lastReadMessageSequence,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(convoInfoOfUser);
  } catch (error) {
    console.log("Error in updateConvoInfoOfUser controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
