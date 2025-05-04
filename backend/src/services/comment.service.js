import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// The service function to get comments for passed in momentIds
// or ALL comments of ALL moments
export const getCommentsWithMomentIdsService = async ({ momentIds }) => {
  try {
    let comments = [];

    // Get comments for momentIds if there are momentIds passed in
    if (momentIds && momentIds.length > 0) {
      comments = await Comment.find({ momentId: { $in: momentIds } })
        .populate("posterId", "fullName profilePic") //show commenter info
        .sort({ createdAt: 1 }); // oldest to newest
      // Get comments for all momemnts
    } else {
      comments = await Comment.find()
        .populate("posterId", "fullName profilePic") //show commenter info
        .sort({ createdAt: 1 }); // oldest to newest
    }

    return { comments: comments, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      comments: null,
      error: error.message || "An error occurred while getting comments",
    };
  }
};

// The service function to post a comment under a moment for logged in user
export const postCommentService = async ({ momentId, posterId, text }) => {
  try {
    // Check the inputs
    if (!momentId) {
      return {
        newComment: null,
        error: "MomentId is required",
      };
    }
    if (!posterId) {
      return {
        newComment: null,
        error: "PosterId is required",
      };
    }
    if (!text) {
      return {
        newComment: null,
        error: "Text is required",
      };
    }

    // Create this new comment
    const newComment = new Comment({
      // We shorten "posterId: posterId" to posterId
      posterId,
      momentId,
      text,
    });

    // Save this new comment to database
    await newComment.save();

    // Hydrate newComment with user information beofre return it
    const user = await User.findById(posterId).select("fullName profilePic");
    if (!user) {
      return res.status(404).json({
        message: "Commented created, but comment poster not found",
      });
    }
    newComment.posterId = user;

    // Return the hydrated moment
    return { newComment: newComment, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      newComment: null,
      error: error.message || "An error occurred while posting comment",
    };
  }
};
