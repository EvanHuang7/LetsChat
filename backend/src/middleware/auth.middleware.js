import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Authentication check
export const protectRoute = async (req, res, next) => {
  try {
    // Get JWT token from API request cookie
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    // Decode the encoded jwt token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    // Get the user info all fields except for password field
    // from datase by passing the userId stored in decoded jwt token
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // In this step, user is authenticated, and we can add user
    // to the request
    req.user = user;

    // Call the next function in last step of this middleware function
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({
      message: "Interal server error",
    });
  }
};
