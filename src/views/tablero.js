/*
 * Author: - Mathis
 * Filename: - tablero.js
 * Module: - Games
 * Description: - Display a boardgame with the postion of the players
 * the cases available and the tokens
 */
import { useState, useRef, useEffect } from "react"
import { useOutletContext, useParams, useLocation } from "react-router-dom"

import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Dialog from "@mui/material/Dialog"
import Grid from "@mui/material/Grid"
import Icon from "@mui/material/Icon"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import { useSocketContext } from "context/socketContext"

import QuestionMulti from "../components/questionMulti"
import Chat from "../components/chat/chat"
import Dice from "react-dice-roll"
import ImageMapper from "../imgMapper/ImageMapper"
import { tableroCoords, tableroMap } from "../imgMapper/tableroMap.js"

const tableroURL = process.env.PUBLIC_URL + "/images/tablero.png"
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]

export default function Tablero() {
    const rid = useParams().rid
    const { state } = useLocation()
    const players = state.players

    const playerInfo = {};

    const [user, setUser] = useOutletContext()
    const { socketService } = useSocketContext()

    const [loading, setLoading] = useState(false)

    const [question, setQuestion] = useState(false)

    const gridRef = useRef()
    const [dimY, setDimY] = useState(null)
    const [dimX, setDimX] = useState(null)

    const [dice, setDice] = useState(false)
    const [diceData, setDiceData] = useState([])

    const [map, setMap] = useState({ name: "empty", areas: [] })
    const [cases, setCases] = useState([])
    // Set reachable case in map
    useEffect(() => {
        setMap((prevState) => ({
            ...prevState,
            areas: tableroMap.areas
                .filter((area) => cases.includes(area.id) || area.shape === "player")
                .concat(...prevState.areas.slice(-players.length)),
        }))
    }, [cases])
    // Set players position in map
    useEffect(() => {
        console.log("players changed", players)
        let newPlayersPos = []
        players.forEach((player, index) => {
            newPlayersPos.push({
                id: player.nickname,
                shape: "player",
                coords: tableroCoords[player.position],
                preFillColor: "rgba(0,0,0,0.3)",
                fillColor: "blue",
                strokeColor: colors[index],
                lineWidth: 6,
                cosmeticId: player.avatar,
            })
        })
        setMap((prevState) => ({
            ...prevState,
            areas: [...prevState.areas.slice(0, cases.length).concat(newPlayersPos)],
        }))
    }, [players, cases])

    function startTurn() {
        socketService.startTurn(rid, (res) => {
            console.log("server respond to : STARTTURN ", res)
            if (res.ok === false) {
                setQuestion(false)
            } else {
                setQuestion(res)
            }
        })
    }

    // Add event listeners
    useEffect(() => {
        function handleResize() {
            if (gridRef.current) {
                setLoading(true)
                setDimX(gridRef.current.clientWidth)
                setDimY(gridRef.current.clientHeight)
                setLoading(false)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        
        startTurn()

        socketService.turn((data) => {
            console.log("server emits : TURN", data, user)
            if (data.turns === user.nickname) {
                setTimeout(() => startTurn(), 500);
            }
            //get and set players position from data.stats
            Object.keys(data.stats).forEach((player) => {
                console.log("player: ", player)
                players[player] = {}
                players[player].position = data.stats[player].position
                players[player].totalAnswers = data.stats[player].totalAnswers
                players[player].correctAnswers = data.stats[player].correctAnswers
                players[player].tokens = data.stats[player].tokens
            })
        });
    }, [])

    // 2 . on correct answer set dice
    const handleCorrectAnswer = (data) => {
        console.log("in handleCorrectAnswer", data)
        setDiceData(data)
        setDice(true)
    }

    // 3. setReachableCases
    const handleReachableCases = (e) => {
        setTimeout( () => {
            setDice(false);
        },3000)
        setCases(diceData.cells)
    }
    // 4. choose the case to move
    const handleMovement = (area) => {
        let pos = area.id
        console.log()
        
        socketService.makeMove({ rid, pos }, (data) => {
            if (data.ok === false) {
                
            } else if ( data.rollAgain === true ) {
                setDice(true)
            } else {
                setDice(false)
            }
            setCases([])
        })
        startTurn();
    }

    return (
        <Grid container sx={{ height: "calc(100vh - 64px)", p: 1 }}>
            {/* Tablero */}
            <Grid
                item
                container
                xs={12}
                lg={10}
                id="gridRef"
                ref={gridRef}
                justifyContent="center"
                sx={{
                    backgroundColor: "accent.main",
                    position: "relative",
                    minHeight: "calc(50vh - 64px)",
                }}
            >
                {map !== undefined && !loading && (
                    <ImageMapper
                        id="map"
                        parentWidth={Math.min((dimY * 4) / 3, dimX)}
                        responsive
                        src={tableroURL}
                        map={map}
                        onClick={(area) => {
                            handleMovement(area)
                        }}
                    />
                )}
                <Dialog
                    open={!!dice}
                    disableEscapeKeyDown
                    onClose={(event) => event.preventDefault()}
                    onBackdropClick={(event) => event.preventDefault()}
                    sx={{ m: 2, backgroundColor: "transparent" }}
                >
                    <Box sx={{ p: 3, backgroundColor: "transparent" }}>
                        <Dice
                            size="75"
                            cheatValue={diceData.roll}
                            rollingTime={1500}
                            onRoll={() => handleReachableCases()}
                        />
                    </Box>
                </Dialog>

                {/* Collapsible chat*/}
                <Accordion
                    sx={{
                        position: "absolute",
                        my: 1,
                        bottom: 0,
                        left: 0,
                        zIndex: 100,
                    }}
                >
                    <AccordionSummary
                        expandIcon={
                            <Icon baseClassName="fas" className="fa-angle-up" />
                        }
                        aria-controls="panel1a-content"
                        id="Chat Header"
                        sx={{
                            backgroundColor: "secondary.main",
                            color: "text.primary",
                            display: "flex",
                        }}
                    >
                        <Typography>Chat</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Chat />
                    </AccordionDetails>
                </Accordion>
            </Grid>
            {/* Side */}
            <Grid
                item
                container
                xs
                lg={2}
                direction="column"
                sx={{ backgroundColor: "light.main" }}
            >
                {/* Categories */}
                <Grid
                    item
                    container
                    spacing={1}
                    sx={{
                        alignContent: "center",
                        justifyContent: "space-around",
                        pt: 2,
                    }}
                >
                    <Grid item xs={4} lg={5}>
                        <Paper
                            elevation={3}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "blue",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/geography.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            Geography
                        </Paper>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "red",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/art.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            Art
                        </Paper>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "yellow",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/history.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            History
                        </Paper>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "green",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/science.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            Science
                        </Paper>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "orange",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/sports.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            Sports
                        </Paper>
                    </Grid>
                    <Grid item xs={4} lg={5}>
                        <Paper
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "pink",
                            }}
                        >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/entertainment.png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            Entertainment
                        </Paper>
                    </Grid>
                </Grid>
                {/* Players */}
                <Grid
                    item
                    container
                    xs
                    direction="column"
                    sx={{
                        alignContent: "center",
                        justifyContent: "space-around",
                        pt: 2,
                    }}
                >
                    {players.map((player, index) => {
                        return (
                            <Grid container item alignItems="center" sx={{ px: 2 }}>
                                <Avatar
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/images/cosmetics/cosmetic_" +
                                        player.avatar +
                                        ".jpg"
                                    }
                                    alt="Avatar"
                                    sx={{
                                        width: "50px",
                                        height: "50px",
                                        mx: 1,
                                        border: "2px solid " + colors[index],
                                    }}
                                />
                                <Typography variant="body">
                                    {player.nickname}
                                </Typography>
                            </Grid>
                        )
                    })}
                </Grid>
            </Grid>

            {/* Question */}
            <Dialog
                open={!!question}
                disableEscapeKeyDown
                onClose={(event) => event.preventDefault()}
                onBackdropClick={(event) => event.preventDefault()}
                fullWidth
                maxWidth="lg"
                aria-describedby="alert-dialog-slide-description"
            >
                <QuestionMulti
                    key={question?.question_id}
                    question={question}
                    timer={48}
                    onCorrectAnswer={handleCorrectAnswer}
                    onCloseDialog={() => {
                        setQuestion(false)
                    }}
                />
            </Dialog>
        </Grid>
    )
}
