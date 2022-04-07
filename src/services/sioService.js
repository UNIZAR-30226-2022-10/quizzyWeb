import { io } from "socket.io-client"

let socket
let apiURL = process.env.REACT_APP_API_ENDPOINT
export const initSocket = (token) => {
    socket = io(apiURL, {
        auth: {
            token,
        },
    })
    console.log(apiURL)
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
