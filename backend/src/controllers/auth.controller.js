import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        // check all feilds in request are empty or not
        if (!fullName || !email || !password ){
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        // check the length of password
        if (password.length < 6 ) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            })
        };

        //TODO: valid the email format
        
        // Check if email elready exists or not
        const user = await User.findOne({email})
        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        // Use bcryptjs package to hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create this new user 
        const newUser = new User({
            fullName: fullName,
            // We can shorten "email: email" to email
            email,
            password: hashedPassword,
        })

        if (newUser) {
            // If a new user created, we need to generate a JWT token 
            // and sent JTW to user via response cookie
            generateToken(newUser._id, res)
            // Save this user to database
            await newUser.save()
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        } else{
            res.status(400).json({
                message: "Invalid user data"
            })           
        }  
    } catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })  
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        // Check if email exists or not
        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({
                message: "Account does not exist"
            })
        }

        // Check password is correct or not
        const isPasswordMatched = await bcrypt.compare(password, user.password)
        if (!isPasswordMatched){
            return res.status(400).json({
                message: "Password is not correct and please try again"
            })
        }

        // If password matches, we need to generate a JWT token
        // and send it to user via API response cookie
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })         
    }
}

export const logout = (req, res) => {
    try {
        // We need to clear out the JWT token in user's browser session
        // via API response cookie
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({
            message: "Logged out successfully"
        })        
    } catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })        
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id

        if (!profilePic){
            res.status(400).json({
                message: "Profile pic is required"
            })             
        }

        // Upload profile pic to cloudinary
        const uploadResult = await cloudinary.uploader.upload(profilePic)

        // Update the user profile pic in database
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResult.secure_url}, {new: true})

        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("Error in updateProfile controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })        
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)        
    } catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({
            message: "Interal server error"
        })        
    }
}