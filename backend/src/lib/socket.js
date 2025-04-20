import {Server} from "socket.io"
import http from "http"
import express from "express"

// Create an Express application
const app = express()
// Create an http server 
const server = http.createServer(app)

// Create socket io server
const io = new Server(server, {
    cors: {
        // specify the front-end client base url
        origin: ["http://localhost:5173"],
    }
})

// Stored the online users, {userId: socketId}
const userSocketMap = {}

// Set socket io server to listen to the connection or
// disconnection events form socket io clients
io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id)

    // When a new user connected to socket, add this user to 
    // the online users list. 
    // Get the userId from the socket io client
    const userId = socket.handshake.query.userId
    if (userId) {
        userSocketMap[userId] = socket.id
    }

    // Send events (all oneline userIds) to all connected socket io client
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user disconnected: " + socket.id)
        
        // When a user disconnected to socket, remove this user 
        // from the online users list
        delete userSocketMap[userId]
        // Send the updated oneline userIds to all connected socket io client
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {app, server, io}