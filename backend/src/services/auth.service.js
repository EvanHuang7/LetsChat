import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// signup service function
export const signupService = async ({ fullName, email, password, res }) => {
  try {
    // check all feilds in are empty or not
    if (!fullName || !email || !password) {
      return {
        newUser: null,
        error: "All fields are required",
      };
    }

    // check the length of password
    if (password.length < 6) {
      return {
        newUser: null,
        error: "Password must be at least 6 characters",
      };
    }

    // Validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        newUser: null,
        error: "Invalid email format",
      };
    }

    // Check if email elready exists or not
    const user = await User.findOne({ email });
    if (user) {
      return {
        newUser: null,
        error: "Email already exists",
      };
    }

    // Use bcryptjs package to hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create this new user
    const newUser = new User({
      fullName: fullName,
      // We can shorten "email: email" to email
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // If a new user created, we need to generate a JWT token
      // and sent JTW to user via response cookie
      generateToken(newUser._id, res);
      // Save this user to database
      await newUser.save();

      // Return the newUser
      return { newUser: newUser, error: null };
    } else {
      return {
        newUser: null,
        error: "Invalid user data",
      };
    }
  } catch (error) {
    // If an error occurs, return the error message
    return {
      newUser: null,
      error: error.message || "An error occurred while signup user",
    };
  }
};

// login service function
export const loginService = async ({ email, password, res }) => {
  try {
    // check all feilds in are empty or not
    if (!email || !password) {
      return {
        user: null,
        error: "All fields are required",
      };
    }

    // Check if email exists or not
    const user = await User.findOne({ email });
    if (!user) {
      return {
        user: null,
        error: "Account does not exist",
      };
    }

    // Check password is correct or not
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return {
        user: null,
        error: "Password is not correct and please try again",
      };
    }

    // If password matches, we need to generate a JWT token
    // and send it to user via API response cookie
    generateToken(user._id, res);

    // Return the user
    return { user: user, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      user: null,
      error: error.message || "An error occurred while login user",
    };
  }
};

// The service function to update profile for logged in user
export const updateProfileService = async ({ userId, profilePic }) => {
  try {
    // check all feilds in are empty or not
    if (!userId) {
      return {
        updatedUser: null,
        error: "UserId is required",
      };
    }
    if (!profilePic) {
      return {
        updatedUser: null,
        error: "ProfilePic is required",
      };
    }

    // Upload base64 profile pic to cloudinary
    const uploadResult = await cloudinary.uploader.upload(profilePic);

    // Update the user profile pic in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    return { updatedUser: updatedUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      updatedUser: null,
      error: error.message || "An error occurred while updating user profile",
    };
  }
};

// The service function to update stickers for logged in user
export const updateStickersService = async ({
  userId,
  add,
  stickerUrl,
  stickerIndex,
  existingStickersList,
}) => {
  try {
    // check all feilds in are empty or not
    if (!userId) {
      return {
        updatedUser: null,
        error: "UserId is required",
      };
    }
    if (!stickerUrl) {
      return {
        updatedUser: null,
        error: "StickerUrl is required",
      };
    }

    // Only deleting a sticker neeed to pass a stickerIndex
    if (!add && (stickerIndex === undefined || stickerIndex === null)) {
      return {
        updatedUser: null,
        error: "StickerIndex is required when deleting a sticker",
      };
    }

    // Clone current stickers list
    let updatedUserStickers = [...existingStickersList];
    // If add a new sticker
    if (add) {
      if (updatedUserStickers.length < 8) {
        updatedUserStickers.push(stickerUrl);
        // Return error if user already has 8 stickers
      } else {
        return {
          updatedUser: null,
          error: "Sorry, a user can only has up to 8 stickers.",
        };
      }
      // If delete an existing sticker
    } else {
      // Only remove the sticker when stickerUrl and
      // stickerIndex are matched in the list.
      if (updatedUserStickers[stickerIndex] === stickerUrl) {
        // Remove 1 item at stickerIndex
        updatedUserStickers.splice(stickerIndex, 1);
      } else {
        return {
          updatedUser: null,
          error: "Sorry, Sticker not found at the provided position.",
        };
      }
    }

    // Update the user stickers in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { stickers: updatedUserStickers },
      { new: true }
    ).select("-password");

    return { updatedUser: updatedUser, error: null };
  } catch (error) {
    // If an error occurs, return the error message
    return {
      updatedUser: null,
      error: error.message || "An error occurred while updating user stickers",
    };
  }
};
