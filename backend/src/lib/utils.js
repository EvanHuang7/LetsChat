import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    // We use unique userId as payload to create the JWT token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    // Send the generated JWT token to user via response cookie
    res.cookie("jwt", token, {
        // This JWT token will be stored as cookie in user's browser session for 7 days.
        // User's browser will send this cookie when making request to same server.
        // After 7 days, user needs to login again to get a new JWT.
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        // Make sure this token is not accessable via JavaScript
        // Prevent XSS attacks, cross-site scripting attacks
        httpOnly: true, 
        // Prevent CSRF attacks, cross-site request forgery attacks
        sameSite: "strict", 
        // determin if it is https or http. https is secure for real production
        // http is not secure for localHost.
        // This field should be True for real production case
        secure: process.env.NODE_ENV !== "development"
    })

    return token
}