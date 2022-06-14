import React, { createContext, useContext }  from 'react'
import { io } from "socket.io-client"

const SocketContext = createContext();

let apiURL = process.env.REACT_APP_API_ENDPOINT

function SocketProvider({children}) {

    let socket;

    /**
     * Initialize socket connection to server.
     */
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
    
    /**
     * Disconnect socket and do callback
     * @param {Function} callback 
     */
    const disconnectSocket = (callback) => {
        if (socket) {
            console.log("Disconnecting socket...")
            callback();
            socket.disconnect()
            console.log("disconnected")
        }
    }
    
    /**
     * Subscribe to messages from chat
     * @param {Function} cb 
     * @returns The result of the callback
     */
    const subscribeToMessages = (cb) => {
        if (!socket) return true
        socket.on("chat:message", (msg) => {
            console.log("mesg")
            return cb(null, msg)
        })
        socket.on("otherConnect", (msg) => {
            return cb(null, msg)
        })
        socket.on("otherDisconnect", (msg) => {
            return cb(null, msg)
        })
    }
    
    /**
     * Send a message
     * @param {Object} param0 An object containing the username, message and room
     * Example : 
     * {
     *     username : "abcde",
     *     message : "hi!",
     *     roomName : 0
     * }
     * @param {Function} cb The acknowledgement function.
     */
    const sendMessage = ({ username,message,roomName }, cb) => {
        if (socket) socket.emit("chat:send", { username, message, roomName}, cb)
    }

    /**
     * Join a public match.
     * @param {Function} joinCallback Acknowledgement function after emitting the request
     * @param {Function} joinedCallback Callback on server response.
     */
    const joinPublicMatch = (joinCallback, joinedCallback) => {
    
        if (socket) {
            console.log("joining match");
            socket.emit("public:join", joinCallback);
            socket.once("server:public:joined", joinedCallback);
        }
    }
    
    /**
     * Leave a public match.
     * @param {Function} cb The acknowledgement function
     */
    const leavePublicMatch = (cb) => {
    
        if (socket) {
            console.log("leaving")
            socket.emit("public:leave", cb);
        }
    }

    /**
     * Listen to turn events while in a match.
     * @param {Function} cb The acknowledgement function, which receives the match information
     * and who's turn is it.
     * Example : 
     *  {
            "turns": "usuario2",
            "stats": {
                "usuario2": {
                    "position": 0,
                    "correctAnswers": [ 0, 0, 0, 0, 0, 0 ],
                    "totalAnswers": [ 0, 0, 0, 0, 0, 0 ],
                    "tokens": [ false, false, false, false, false, false ]
                },
                "usuario1": {
                    "position": 0,
                    "correctAnswers": [ 0, 0, 0, 0, 0, 0 ],
                    "totalAnswers": [ 0, 0, 0, 0, 0, 0 ],
                    "tokens": [ false, false, false, false, false, false ]
                }
            },
            "timer": 15000
        }
     */
    const turn = (cb) => {
        if (socket) socket.on("server:turn", cb);
    }

    /**
     * Try to start turn
     * @param {BigInt} rid The room ID
     * @param {Boolean} pub True if match is public, false otherwise 
     * @param {Function} cb The acknowledgement function. If it's the user's turn,
     * the callback will receive the turn's question.
     * Example : 
     *  {
            "currentQuestion": {
                "question_id": 190,
                "category_name": "Entertainment",
                "question": "In «Star Trek», what is the Ferengi´s First Rule of Acquisition?",
                "difficulty": "medium",
                "correct_answer": "Once you have their money, you never give it back. ",
                "wrong_answer_1": "Never place friendship above profit",
                "wrong_answer_2": "Greed is Eternal",
                "wrong_answer_3": "Never allow family to stand in the way of opportunity",
                "accepted": true,
                "nickname": null
            },
            "timeout": 15000
        }
     */
    const startTurn = (rid, pub, cb) => {
        if (socket) {
            console.log(rid);
            if ( pub === true )
                socket.emit("public:startTurn", { rid }, cb);
            else
                socket.emit("private:startTurn", { rid }, cb);
        }
    }

    /**
     * 
     * @param {String} answer The answer string
     * @param {Boolean} pub 
     * @param {Function} cb 
     * Example:
        {
            "ok": true,
            "continue": true,
            "roll": {
                "roll": 5,
                "cells": [ 20, 54, 24, 26, 30, 32, 36, 38, 42, 44, 48, 50 ]
            }
        }
     */
    const answerQuestion = (answer, pub, cb) => {
        if (socket) socket.emit(`${pub ? "public" : "private"}:answer`, answer, cb);
    }

    /**
     * 
     * @param {Object} args 
     * @param {Boolean} pub 
     * @param {Function} cb The acknowledgement function. If the user can roll the dice again,
     * then rollAgain will be set to true, and the new roll will be sent as well.
     * Example:
     *  {
            "ok": true,
            "rollAgain": true,
            "roll": 1,
            "cells": [
                21,
                23
            ]
        } 
     */
    const makeMove = (args, pub, cb) => {
        if (socket) socket.emit(`${pub ? "public" : "private"}:makeMove`, args, cb);
    }

    const questionTimeout= (cb) => {
        if (socket) socket.on("server:timeout", cb);
    }

    const hasWon = (cb) => {
        if (socket) socket.on("server:winner", cb);
    }

    const createPrivateMatch = ( args, cb ) => {
        if (socket) socket.emit("private:create", args, cb);
    }
    
    const joinPrivateMatch = (rid, cb) => {
        if (socket) socket.emit("private:join", { rid }, cb)
    }

    const leaveRoom = (rid, cb) => {
        if (socket) socket.emit("private:leave", { rid }, cb)
    }

    const startGame = (rid, cb) => {
        if (socket) socket.emit("private:start", { rid }, cb)
    }

    const listenNewPlayers = (cb) => {
        if (socket) socket.on("server:private:player:join", cb);
    }

    const listenLeavePlayers = (cb) => {
        if (socket) socket.on("server:private:player:leave", cb);
    }

    const pauseGame = (rid, pub, cb) => {
        if ( socket ) {
            if ( pub === true )
                socket.emit("public:pause", { rid }, cb);
            else
                socket.emit("private:pause", { rid }, cb);
        }
    }

    const resumeGame = (rid, pub, cb) => {
        if ( socket ) {
            if ( pub === true )
                socket.emit("public:resume", { rid }, cb);
            else
                socket.emit("private:resume", { rid }, cb);
        }
    }

    const cleanup = (event) => {
        if (socket) {
            console.log("cleanup : ", event)
            socket.off(event);
        }
    }

    const socketService = {
        initSocket,
        disconnectSocket,
        sendMessage,
        subscribeToMessages,
        joinPublicMatch,
        leavePublicMatch,
        turn,
        startTurn,
        answerQuestion,
        questionTimeout,
        makeMove,
        hasWon,
        createPrivateMatch,
        joinPrivateMatch,
        leaveRoom,
        startGame,
        listenNewPlayers,
        listenLeavePlayers,
        pauseGame,
        resumeGame,
        cleanup,
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