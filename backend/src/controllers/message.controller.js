import User from "../models/user.model.js";


// Get all users except for logged in user for side bar contact list
export const getUsersForSidebar = async (req, res) => {
    try {
        // Get current logged in userId
        const loggedInUserId = req.user._id
        // Get the all fields info except for password field of 
        // all users that are not equal to logged in userId
        const filteredUsers = await User.find({
            _id: {$ne: loggedInUserId}
        }).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getUsersForSidebar controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })         
    }
}