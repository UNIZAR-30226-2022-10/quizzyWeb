import { io } from "socket.io-client"

let socket
let apiURL = process.env.REACT_APP_API_ENDPOINT
export const initSocket = (token) => {
    console.log("connecting")
    socket = io(apiURL, {
        auth: {
            token,
        },
    })
}

export const disconnectSocket = (callback) => {
    if (socket) {
        console.log("Disconnecting socket...")
        callback();
        socket.disconnect()
        console.log("disconnected")
    }
}

// Handle message receive event
export const subscribeToMessages = (cb) => {
    if (!socket) return true
    socket.on("chat:message", (msg) => {
        return cb(null, msg)
    })
    socket.on("otherConnect", (msg) => {
        return cb(null, msg)
    })
    socket.on("otherDisconnect", (msg) => {
        return cb(null, msg)
    })
}

export const sendMessage = ({ message,roomName }, cb) => {
    let username = JSON.parse(localStorage.getItem("user")).nickname
    if (socket) socket.emit("chat:send", { username, message, roomName}, cb)
}

export const joinRoom = (roomName, cb) => {
    if (socket) socket.emit("join", roomName, cb)
}

export const joinPublicMatch = (joinCallback, joinedCallback) => {

    if (socket) {
        socket.emit("public:join", joinCallback);
        socket.on("server:public:joined", joinedCallback);
    }
}

export const leavePublicMatch = () => {

    if (socket) {
        socket.emit("public:leave", ({ok, msg}) => { console.log("leaving queue") });
    }
}