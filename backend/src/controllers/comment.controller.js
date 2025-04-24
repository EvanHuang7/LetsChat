import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// Get comments for passed in momentIds or ALL comments of ALL moments
export const getCommentsWithMomentIds = async (req, res) => {
  try {
    // Get momentIds from reqest body
    const { momentIds } = req.body;

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

    res.status(200).json(comments);
  } catch (error) {
    console.log("Error in getCommentsWithMomentIds controller", error.message);
    res.status(500).json({
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

    // Check the inputs from request body
    if (!momentId) {
      return res.status(400).json({
        message: "MomentId is required",
      });
    }
    if (!text) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    // Create this new comment
    const newComment = new Comment({
      // We shorten "posterId: posterId" to posterId
      posterId,
      momentId,
      text,
    });

    // Save this new message to database
    await newComment.save();

    // Hydrate newComment with user information beofre return it
    const user = await User.findById(posterId).select("fullName profilePic");
    if (!user) {
      return res.status(404).json({
        message: "Commented created, but comment poster not found",
      });
    }
    newComment.posterId = user;

    res.status(201).json(newComment);
  } catch (error) {
    console.log("Error in postComment controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
