import { useEffect, useState, useRef } from "react"
import {
    initSocket,
    disconnectSocket,
    subscribeToMessages,
    sendMessage,
    joinRoom,
} from "utils/sioService"

import "./Chat.css"
import UserMessage from "./UserMessage"
import SystemMessage from "./SystemMessage"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import SendIcon from "@material-ui/icons/Send"

function DateToHoursAndMinutes(datestring) {
    const date = new Date(datestring)
    return date.toLocaleTimeString().slice(0, 5)
}

function Chat() {
    const MAIN_CHAT_ROOM = "main"

    const [token, setToken] = useState("veryverysecret") //TODO: remove this
    const [chatMessage, setChatMessage] = useState([])
    const [messages, setMessages] = useState([])
    const [room, setRoom] = useState(MAIN_CHAT_ROOM)

    const tokenInputRef = useRef("")
    const roomInputRef = useRef("")
    const inputRef = useRef("")

    useEffect(() => {
        // Init socket
        initSocket(token)

        subscribeToMessages((err, data) => {
            setMessages((prev) => [...prev, data])
        })

        // Cleanup when user disconnects
        return () => {
            disconnectSocket()
        }
    }, [token])

    const submitToken = (e) => {
        e.preventDefault()
        const tokenValue = tokenInputRef.current.value
        setToken(tokenValue)
    }

    const submitRoom = (e) => {
        // TO-DO add support for joining rooms
        e.preventDefault()
        const roomValue = roomInputRef.current.value
        setRoom(roomValue)
        joinRoom(roomValue, (cb) => {
            console.log(cb)
        })
    }

    const submitMessage = (e) => {
        e.preventDefault()
        const message = chatMessage
        if (message) {
            sendMessage({ message }, (cb) => {
                // clear the input after the message is sent
                setChatMessage("")
            })
        }
    }

    const inputChange = (e) => {
        e.preventDefault()
        setChatMessage(e.target.value)
    }

    return (
        <Grid container wrap="nowrap" direction="column" className="chat-wrapper">
            <Grid
                container
                wrap="nowrap"
                item
                direction="column"
                rowSpacing={1}
                className="chat-messages"
            >
                {messages.map((user, k) => (
                    <>
                        {user.message ? (
                            <UserMessage
                                avatar={""}
                                side="right"
                                sender={user.name}
                                message={user.message}
                                time={DateToHoursAndMinutes(user.time)}
                            />
                        ) : (
                            <>
                                {user.systemMsg === "connected" ? (
                                    <SystemMessage
                                        type="success"
                                        message={user.name + " has joined the chat"}
                                    />
                                ) : (
                                    <>
                                        {user.systemMsg === "disconnected" ? (
                                            <SystemMessage
                                                type="error"
                                                message={
                                                    user.name + " has left the chat"
                                                }
                                            />
                                        ) : (
                                            <SystemMessage
                                                type="warning"
                                                message={user.name + user.systemMsg}
                                            />
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </>
                ))}
            </Grid>
            <Grid item>
                <form className="chat-input" onSubmit={submitMessage}>
                    <TextField
                        autoFocus
                        placeholder="Send a message"
                        variant="outlined"
                        value={chatMessage}
                        fullWidth
                        onChange={inputChange}
                    />
                    <Button variant="contained" type="submit" endIcon={<SendIcon />}>
                        Submit
                    </Button>
                </form>
            </Grid>
        </Grid>
    )
}

export default Chat
