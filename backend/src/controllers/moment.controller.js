import User from "../models/user.model.js";
import Moment from "../models/moment.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";

// Get 10 moments with comments for one passed in userId or all users
// USAGE: Display 10 moments in moments page
export const getMoments = async (req, res) => {
  try {
    // Get userId from url param
    const { id: userId } = req.params;
    // Get lastMomentCreatedAt from reqest body
    const { lastMomentCreatedAt } = req.body;

    // Parse the timestamp if it's provided
    const createdBefore = lastMomentCreatedAt
      ? new Date(lastMomentCreatedAt)
      : null;

    // Build query object
    const query = {};
    if (userId !== "all") {
      query.posterId = userId;
    }
    if (createdBefore) {
      query.createdAt = { $lt: createdBefore };
    }

    // TODO: Update limit to 10 after finishing test

    // Get moments with moment poster info first
    const moments = await Moment.find(query)
      .populate("posterId", "fullName profilePic")
      .sort({ createdAt: -1 }) // from newest to oldest
      .limit(3); // return 10 moments only

    // Then, get all comments with comment poster info
    // belonging to these moments
    const momentIds = moments.map((m) => m._id);
    const comments = await Comment.find({ momentId: { $in: momentIds } })
      .populate("posterId", "fullName profilePic") //show commenter info
      .sort({ createdAt: 1 }); // oldest to newest

    // Lastly, attach comments to corresponding moment
    const momentsWithComments = moments.map((moment) => {
      const momentComments = comments.filter(
        (comment) => comment.momentId.toString() === moment._id.toString()
      );

      return {
        ...moment.toObject(),
        comments: momentComments,
      };
    });

    res.status(200).json(momentsWithComments);
  } catch (error) {
    console.log("Error in getMoments controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Post a moment for logged in user
// USAGE: Post a moment from moment writer
export const postMoment = async (req, res) => {
  try {
    // Get text or image from reqest body
    const { text, image } = req.body;

    // Get current logged in userId as posterId
    const posterId = req.user._id;

    // Check the inputs from request body
    if (!text && !image) {
      return res.status(400).json({
        message: "At least provide text or image",
      });
    }

    // Check image in request is empty or not
    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary if it's not empty
      const uploadResult = await cloudinary.uploader.upload(image);
      imageUrl = uploadResult.secure_url;
    }

    // Create this new moment
    const newMoment = new Moment({
      // We shorten "senderId: senderId" to senderId
      posterId,
      text,
      image: imageUrl,
    });
    // Save this new moment to database
    await newMoment.save();

    // Hydrate newMoment with user information beofre return it
    const user = await User.findById(posterId).select("fullName profilePic");
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }
    newMoment.posterId = user;

    res.status(201).json(newMoment);
  } catch (error) {
    console.log("Error in postMoment controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update like field of specific moment for logged in user
// USAGE: Click like button in each moment
export const updateLikeForMoment = async (req, res) => {
  try {
    const { momentId, like } = req.body;

    // Get current logged in userId as userId
    const userId = req.user._id;

    // Check the inputs from request body
    if (!momentId) {
      return res.status(400).json({
        message: "MomentId is required",
      });
    }

    let updatedMoment;
    // Add logged in user to like list of the moment
    if (like) {
      updatedMoment = await Moment.findByIdAndUpdate(
        momentId,
        {
          $addToSet: { userIdsOfLike: userId }, // prevents duplicates
        },
        { new: true }
      );
    } else {
      updatedMoment = await Moment.findByIdAndUpdate(
        momentId,
        {
          $pull: { userIdsOfLike: userId },
        },
        { new: true }
      );
    }

    // Hydrate updatedMoment with user and comments information beofre return it
    const user = await User.findById(updatedMoment.posterId).select(
      "fullName profilePic"
    );
    if (!user) {
      return res.status(404).json({
        message: "Moment updated, but poster not found",
      });
    }
    const comments = await Comment.find({ momentId: updatedMoment._id })
      .populate("posterId", "fullName profilePic") //show commenter info
      .sort({ createdAt: 1 }); // oldest to newest

    // Can not use "updatedMoment.comments = comments" to assign value because
    // updatedMoment is a Mongoose document, and directly assigning comments
    // (a field not in its schema) doesn’t include it in the response JSON by default

    // Convert updatedMoment to a plain object first, so we can attach
    // custom fields like comments and have them included in the final response

    let hydratedMoment = updatedMoment.toObject(); // 👈 make it a plain JS object

    hydratedMoment.posterId = user;
    hydratedMoment.comments = comments; // will always be an array, even if empty

    res.status(200).json(hydratedMoment);
  } catch (error) {
    console.log("Error in updateLikeForMoment controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
