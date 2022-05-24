import React, { createContext, useContext }  from 'react'
import { io } from "socket.io-client"

const SocketContext = createContext();

let apiURL = process.env.REACT_APP_API_ENDPOINT

function SocketProvider({children}) {

    let socket;

    const initSocket = (token) => {
        if ( !socket ) {
            console.log("connecting");
            socket = io(apiURL, {
                auth: {
                    token : localStorage.getItem("token")
                },
            })
        }
    }
    
    const disconnectSocket = (callback) => {
        if (socket) {
            console.log("Disconnecting socket...")
            callback();
            socket.disconnect()
            console.log("disconnected")
        }
    }
    
    // Handle message receive event
    const subscribeToMessages = (cb) => {
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
    // Send message to all client in the room
    const sendMessage = ({ username,message,roomName }, cb) => {
        if (socket) socket.emit("chat:send", { username, message, roomName}, cb)
    }
    
    const joinRoom = (roomName, cb) => {
        if (socket) socket.emit("join", roomName, cb)
    }

    const joinPublicMatch = (joinCallback, joinedCallback) => {
    
        if (socket) {
            console.log("joining match");
            socket.emit("public:join", joinCallback);
            socket.on("server:public:joined", joinedCallback);
        }
    }
    
    const leavePublicMatch = (cb) => {
    
        if (socket) {
            console.log("leaving")
            socket.emit("public:leave", cb);
        }
    }

    const turn = (cb) => {
        if (socket) socket.on("server:turn", cb);
    }

    const startTurn = (rid, cb) => {
        if (socket) socket.emit("public:startTurn", { rid }, cb);
    }

    const answerQuestion = (answer, cb) => {
        if (socket) socket.emit("public:answer", answer, cb);
    }

    const questionTimeout= (cb) => {
        if (socket) socket.on("server:timeout", cb);
    }

    const makeMove = (args, cb) => {
        if (socket) socket.emit("public:makeMove", args, cb);
    }

    const socketService = {
        initSocket,
        disconnectSocket,
        sendMessage,
        joinRoom,
        subscribeToMessages,
        joinPublicMatch,
        leavePublicMatch,
        turn,
        startTurn,
        answerQuestion,
        questionTimeout,
        makeMove
    }

    return (
        <SocketContext.Provider value={{ socket, socketService }} >
            {children}
        </SocketContext.Provider>
    )
}

function useSocketContext () {
    const ctx = useContext(SocketContext)
    if ( ctx === undefined ) {
        throw new Error("SocketContext can be used only within a SocketProvider.")
    }

    return ctx
}

export { SocketProvider, useSocketContext }