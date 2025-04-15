import User from "../models/user.model.js";
import Message from "../models/message.model.js";


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

// Get all messages between the userId in url and logged in user
export const getMessages = async (req, res) => {
    try {
        // Get the userID from the url and rename this variable
        // from id to userToChatId
        const { id : userToChatId } = req.params

        // Get current logged in userId
        const loggedInUserId = req.user._id

        // Find all messages between the userId in url and logged in user
        const messages = await Message.find({
            $or: [
                {
                    senderId: loggedInUserId,
                    receiverId: userToChatId,
                },
                {
                    senderId: userToChatId,
                    receiverId: loggedInUserId,                    
                }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })         
    }
}

// Send a message (text or img) from logged in user to the userId in url 
export const sendMessage = async (req, res) => {
    try {
        // Get text or image from reqest body
        const { text, image } = req.body

        // Get the userID from the url and rename this variable
        // from id to receiverId
        const { id : receiverId } = req.params

        // Get current logged in userId as senderId
        const senderId = req.user._id

        // Check image in request is empty or not
        let imageUrl
        if (image){
            // Upload base64 image to cloudinary if it's not empty
            const uploadResult = await cloudinary.uploader.upload(image)
            imageUrl = uploadResult.secure_url
        }

        // Create this new message 
        const newMessage = new Message({
            // We shorten "senderId: senderId" to senderId
            senderId,
            receiverId,
            text, 
            image: imageUrl,
        })
        // Save this new message to database
        await newMessage.save()

        //TODO: add real time functionality in latter front-end part

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })         
    }
}