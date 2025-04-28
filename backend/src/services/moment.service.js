import User from "../models/user.model.js";
import Moment from "../models/moment.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../lib/cloudinary.js";

// The service function to get 10 moments with comments
// for one passed in userId or all users
export const getMomentsService = async ({ userId, lastMomentCreatedAt }) => {
  try {
    // Validate if the userId exists
    if (!userId) {
      return {
        momentsWithComments: null,
        error: "UserId is required",
      };
    }

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

    // First, Get moments with moment poster info
    const moments = await Moment.find(query)
      .populate("posterId", "fullName profilePic")
      .sort({ createdAt: -1 }) // from newest to oldest
      .limit(10); // return 10 moments only

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

    return { momentsWithComments: momentsWithComments, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      momentsWithComments: null,
      error: error.message || "An error occurred while getting moments",
    };
  }
};

// The service function to post a moment for logged in user
export const postMomentService = async ({ posterId, text, image }) => {
  try {
    // Check the inputs
    if (!posterId) {
      return {
        newMoment: null,
        error: "PosterId is required",
      };
    }
    if (!text && !image) {
      return {
        newMoment: null,
        error: "At least provide text or image",
      };
    }

    // Check image in request is empty or not
    let imageUrl;

    if (image) {
      // Check if the image is already a Cloudinary hosted URL
      const isCloudinaryUrl = image.startsWith("https://res.cloudinary.com/");

      // Use existing URL directly to avoid uploading again for saving space
      if (isCloudinaryUrl) {
        imageUrl = image;
      } else {
        // Upload base64 image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image);
        imageUrl = uploadResult.secure_url;
      }
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

    // Return the hydrated moment
    return { newMoment: newMoment, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      newMoment: null,
      error: error.message || "An error occurred while posting moment",
    };
  }
};

// The service function to update like field of
// specific moment for logged in user
export const updateLikeForMomentService = async ({
  momentId,
  userId,
  like,
}) => {
  try {
    // Validate input
    if (!momentId) {
      return {
        hydratedMoment: null,
        error: "MomentId is required",
      };
    }
    if (!userId) {
      return {
        hydratedMoment: null,
        error: "UserId is required",
      };
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
      ).populate("posterId", "fullName profilePic");
    } else {
      updatedMoment = await Moment.findByIdAndUpdate(
        momentId,
        {
          $pull: { userIdsOfLike: userId },
        },
        { new: true }
      ).populate("posterId", "fullName profilePic");
    }

    // Hydrate updatedMoment with comments information beofre return it
    const comments = await Comment.find({ momentId: updatedMoment._id })
      .populate("posterId", "fullName profilePic") //show commenter info
      .sort({ createdAt: 1 }); // oldest to newest

    // Can not use "updatedMoment.comments = comments" to assign value because
    // updatedMoment is a Mongoose document, and directly assigning comments
    // (a field not in its schema) doesn’t include it in the response JSON by default

    // Convert updatedMoment to a plain object first, so we can attach
    // custom fields like comments and have them included in the final response

    let hydratedMoment = updatedMoment.toObject(); // 👈 make it a plain JS object
    hydratedMoment.comments = comments; // will always be an array, even if empty

    return { hydratedMoment: hydratedMoment, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      hydratedMoment: null,
      error:
        error.message || "An error occurred while updating like for moment",
    };
  }
};
