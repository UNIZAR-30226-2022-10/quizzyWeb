import { useEffect, useState, useRef } from "react"

import "css/chat.css"
import UserMessage from "./UserMessage"
import SystemMessage from "./SystemMessage"

import Button from "@mui/material/Button"
import CssBaseline from "@mui/material/CssBaseline"
import Grid from "@mui/material/Grid"
import SendIcon from "@material-ui/icons/Send"
import { useSocketContext } from "context/socketContext"

function DateToHoursAndMinutes(datestring) {
    const date = new Date(datestring)
    return date.toLocaleTimeString().slice(0, 5)
}

function Chat() {

    const { socket, socketService } = useSocketContext();

    const [token, setToken] = useState(localStorage.getItem('token')) 
    const [chatMessage, setChatMessage] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {

        socketService.subscribeToMessages((err, data) => {
            setMessages((prev) => [...prev, data])
        })
    }, [token])

    const submitToken = (e) => {
        e.preventDefault()
        const tokenValue = tokenInputRef.current.value
        setToken(tokenValue)
    }

    const submitRoom = (e) => {
        // TODO: add dynamic room support
        e.preventDefault()
        const roomValue = roomInputRef.current.value
        setRoom(roomValue)
        socketService.joinRoom(roomValue, (cb) => {
            console.log(cb)
        })
    }

    const submitMessage = (e) => {
        e.preventDefault()
        const message = chatMessage
        if (message) {
            socketService.sendMessage({ message, roomName: 'main' }, (cb) => {
                // clear the input after the message is sent
                setChatMessage("")
                setMessages((prev) => [...prev, {username:'Me', message: message, self: true}])

            })
        }
    }

    const inputChange = (e) => {
        e.preventDefault()
        setChatMessage(e.target.value)
    }

    return (
        <Grid 
            container 
            wrap="nowrap" 
            direction="column" 
            className="chat-wrapper"
        >
            <CssBaseline />
            <Grid
                container
                wrap="nowrap"
                item
                direction="column"
                rowSpacing={1}
                className="chat-messages"
            >
                {messages.map((item, k) => (
                    <>
                        {item.message ? (
                            <UserMessage
                                key={"user-message-"+k}
                                avatar={""}
                                side= {item.self ? "right":"left"}
                                sender={item.name}
                                message={item.message}
                                time={DateToHoursAndMinutes(item.time)}
                            />
                        ) : (
                            <>
                                {item.systemMsg === "connection" ? (
                                    <SystemMessage
                                        key={"connection-msg-" + k}
                                        type="success"
                                        message={item.name + " has joined the chat"}
                                    />
                                ) : (
                                    <>
                                        {item.systemMsg === "disconnection" ? (
                                            <SystemMessage
                                                key={"disconnection-msg-" + k}
                                                type="error"
                                                message={
                                                    item.name + " has left the chat"
                                                }
                                            />
                                        ) : (
                                            <SystemMessage
                                                key={"warning-message-"+k}
                                                type="warning"
                                                message={item.name + item.systemMsg}
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
