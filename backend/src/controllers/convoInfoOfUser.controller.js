import {
  getAllConvoInfoOfUserService,
  getConvoInfoOfUserbyIdsService,
  createConvoInfoOfUserService,
  updateConvoInfoOfUserService,
} from "../services/convoInfoOfUser.service.js";

// Get all conversation information for logged in user
// FRONT-END USAGE: Display all conversations when logged in user views
// friends + groups / all conversations list in sidebar
// BACK-END USAGE:
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
// with userId and conversationId.
// FRONT-END USAGE:
// BACK-END USAGE: Call the service function to get a updated convoInfoOfUser
// after group's creater updated a group conversation info.
// Also, call the service function to check if having an existing convoInfoOfUser
// before creating one in createConvoInfoOfUser API
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

// Create a conversation information for logged in user.
// FRONT-END USAGE:
// BACK-END USAGE: Call the service function to create a convoInfoOfUser
// after a new group conversation created or a new user accepted group invite.
// Create 2 convoInfoOfUser records after a user accepted friend connection.
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
// FRONT-END USAGE: Update "lastReadMessageSequence" field when a user clicked
// and viewed a conversation or, left a conversation.
// BACK-END USAGE:
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
