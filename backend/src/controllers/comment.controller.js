import {
  getCommentsWithMomentIdsService,
  postCommentService,
} from "../services/comment.service.js";

// Get comments for passed in momentIds or ALL comments of ALL moments
export const getCommentsWithMomentIds = async (req, res) => {
  try {
    // Get momentIds from reqest body
    const { momentIds } = req.body;

    // Call the service function to get comments
    const { comments, error } = await getCommentsWithMomentIdsService({
      momentIds,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(comments);
  } catch (error) {
    console.log("Error in getCommentsWithMomentIds controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Post a comment under a moment for logged in user
export const postComment = async (req, res) => {
  try {
    // Get text and momentId from reqest body
    const { momentId, text } = req.body;
    // Get current logged in userId as posterId
    const posterId = req.user._id;

    // Call the service function to post comment
    const { newComment, error } = await postCommentService({
      momentId,
      posterId,
      text,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(201).json(newComment);
  } catch (error) {
    console.log("Error in postComment controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
