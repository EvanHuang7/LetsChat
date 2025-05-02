import {
  loginService,
  signupService,
  toggleMessageNotificationService,
  updateProfileService,
  updateStickersService,
} from "../services/auth.service.js";
import { generateStreamToken } from "../lib/stream.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Call the service function to signup a new user
    const { newUser, error } = await signupService({
      fullName,
      email,
      password,
      res,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      stickers: newUser.stickers,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the service function to signup a new user
    const { user, error } = await loginService({
      email,
      password,
      res,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      stickers: user.stickers,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    // We need to clear out the JWT token in user's browser session
    // via API response cookie
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Check if user is authenticated
export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Get Stream token for logged in user
// USAGE: get user stream token for video call
export const getStreamToken = async (req, res) => {
  try {
    const token = generateStreamToken(req.user.id);

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update profile for logged in user
// USAGE: update user profile picture in Profile page.
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    // Call the service function to update profile
    const { updatedUser, error } = await updateProfileService({
      userId,
      profilePic,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Update stickers for logged in user
// USAGE: add or delete a sticker from stickers list of user.
export const updateStickers = async (req, res) => {
  try {
    const { add, stickerUrl, stickerIndex } = req.body;
    const userId = req.user._id;
    const existingStickersList = req.user.stickers;

    // Call the service function to update stickers
    const { updatedUser, error } = await updateStickersService({
      userId,
      add,
      stickerUrl,
      stickerIndex,
      existingStickersList,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateStickers controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};

// Toggle message notification for logged in user
// USAGE: toggle user's message notification.
export const toggleMessageNotification = async (req, res) => {
  try {
    const { messageNotificationState } = req.body;
    const userId = req.user._id;

    const { updatedUser, error } = await toggleMessageNotificationService({
      userId,
      messageNotificationState,
    });
    if (error) {
      return res.status(400).json({
        message: error,
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in toggleMessageNotification controller", error.message);
    return res.status(500).json({
      message: "Interal server error",
    });
  }
};
