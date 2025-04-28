import {
  getMomentsService,
  postMomentService,
  updateLikeForMomentService,
} from "../services/moment.service.js";

// Get 10 moments with comments for one passed in userId or all users
// USAGE: Display 10 moments in moments page
export const getMoments = async (req, res) => {
  try {
    // Get userId from url param
    const { id: userId } = req.params;
    // Get lastMomentCreatedAt from reqest body
    const { lastMomentCreatedAt } = req.body;

    // Call the service function to get the moments
    const { momentsWithComments, error } = await getMomentsService({
      userId,
      lastMomentCreatedAt,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(momentsWithComments);
  } catch (error) {
    console.log("Error in getMoments controller", error.message);
    return res.status(500).json({
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

    // Call the service function to post a moment
    const { newMoment, error } = await postMomentService({
      posterId,
      text,
      image,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(201).json(newMoment);
  } catch (error) {
    console.log("Error in postMoment controller", error.message);
    return res.status(500).json({
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

    // Call the service function to update like
    const { hydratedMoment, error } = await updateLikeForMomentService({
      momentId,
      userId,
      like,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(hydratedMoment);
  } catch (error) {
    console.log("Error in updateLikeForMoment controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
