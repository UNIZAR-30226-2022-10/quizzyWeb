import { io } from "socket.io-client"

let socket

export const initSocket = (token) => {
    socket = io("http://localhost:5000", {
        auth: {
            token,
        },
    })
    console.log(`Connecting socket...`)
}

export const disconnectSocket = () => {
    console.log("Disconnecting socket...")
    if (socket) socket.disconnect()
}

// Handle message receive event
export const subscribeToMessages = (cb) => {
    if (!socket) return true
    socket.on("message", (msg) => {
        return cb(null, msg)
    })
    socket.on("connected", (msg) => {
        return cb(null, msg)
    })
    socket.on("disconnected", (msg) => {
        return cb(null, msg)
    })
}

export const sendMessage = ({ message }, cb) => {
    if (socket) socket.emit("message", { message }, cb)
}

export const joinRoom = (roomName, cb) => {
    if (socket) socket.emit("join", roomName, cb)
}
