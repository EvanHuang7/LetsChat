import User from "../models/user.model.js";
import Moment from "../models/moment.model.js";
import cloudinary from "../lib/cloudinary.js";

// Get all moments for one passed in userId or all users
export const getMoments = async (req, res) => {
  try {
    const { id: userId } = req.params;
    let moments = [];

    if (userId === "All") {
      moments = await Moment.find()
        // populate poster field with selected fields
        // it's kind of joining with User table
        .populate("posterId", "fullName profilePic")
        .sort({ createdAt: -1 });
    } else {
      moments = await Moment.find({ posterId: userId })
        .populate("posterId", "fullName profilePic")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(moments);
  } catch (error) {
    console.log("Error in getMoments controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Post a moment for logged in user
export const postMoment = async (req, res) => {
  try {
    // Get text or image from reqest body
    const { text, image } = req.body;

    // Get current logged in userId as posterId
    const posterId = req.user._id;

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
    // Save this new message to database
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
export const updateLikeForMoment = async (req, res) => {
  try {
    const { momentId, like } = req.body;

    // Get current logged in userId as userId
    const userId = req.user._id;

    if (!momentId) {
      res.status(400).json({
        message: "Moment is required",
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

    res.status(200).json(updatedMoment);
  } catch (error) {
    console.log("Error in updateLikeForMoment controller", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
