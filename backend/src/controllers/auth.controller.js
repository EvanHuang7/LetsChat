import bcript from "bcryptjs";

import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";


export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        // TODO: check if fullName and email are empty or not

        // check if the length of password
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
        const salt = await bcript.getSalt(10)
        const hashedPassword = await bcript.hash(password, salt)

        // Create this new user 
        const newUser = new User({
            fullName: fullName,
            // We can shorten "email: email" to email
            email,
            passsword: hashedPassword
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

export const login = (req, res) => {
    res.send("login route");
}

export const logout = (req, res) => {
    res.send("logout route");
}