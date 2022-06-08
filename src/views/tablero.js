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
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
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
const categories = [
    {name : "geography", color: 'blue'}, 
    {name : "art", color: 'red'},
    {name : "history", color: 'yellow'},
    {name : "science", color: 'green'},
    {name : "sports", color: 'orange'},
    {name : "entertainment", color: 'pink'},
]
export default function Tablero() {
    const rid = parseInt(useParams().rid);
    const { state } = useLocation()
    const [players,setPlayers] = useState(state.players);

    const [user, setUser] = useOutletContext()
    const { socketService } = useSocketContext()

    const [loading, setLoading] = useState(false)

    const [question, setQuestion] = useState(false)
    const [questionTimeout, setQuestionTimeout] = useState(null)
    const [winner, setWinner] = useState(null)

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
                .filter((area) => cases.includes(area.id))
                .concat(...prevState.areas.slice(-players.length)),
        }))
    }, [cases])

    // Set players position in map
    useEffect(() => {
        console.log("players or cases changed", players)
        let newPlayersPos = []
        Object.keys(players).forEach((key, index) => {
            newPlayersPos.push({
                id: key,
                shape: "player",
                coords: tableroCoords[players[key].position],
                preFillColor: "rgba(0,0,0,0.3)",
                fillColor: "blue",
                strokeColor: colors[index],
                lineWidth: 6,
                cosmeticId: players[key].avatar,
            })
        })
        setMap((prevState) => ({
            ...prevState,
            areas: [...prevState.areas.slice(0, cases.length).concat(newPlayersPos)],
        }))
    },[players])

    const startTurn = () => {
        //TODO: FIX ERROR WHEN RESPONDING TO QUICK TO QUESTION IT DON'T THE QUESTION
        setQuestion(false)
        console.log(state)
        socketService.startTurn(rid, state.pub, (res) => {
            console.log("server respond to : STARTTURN ", res)
            if (res.ok === false) {
                console.log("error starting turn : ", res.msg)  
            } else {
                setQuestion(res.currentQuestion)
                setQuestionTimeout(res.timeout/1000)
            }
        })
    };
    
    // Resize the grid when the window is resized and at initial render
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
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    //  0 - Listeners
    useEffect(() => {
        startTurn()

        socketService.turn((data) => {
            console.log("server emits : TURN", data, user)
            if (data.turns === user.nickname) {
                startTurn()
            }
            // Update players from data.stats
            let newPlayers = {}
            Object.keys(data.stats).forEach((player) => {
                newPlayers = {
                    ...newPlayers,
                    [player]: {
                        ...players[player],
                        position: data.stats[player].position,
                        totalAnswers: data.stats[player].totalAnswers,
                        correctAnswers: data.stats[player].correctAnswers,
                        tokens: data.stats[player].tokens
                    }
                }
            })
            setPlayers(newPlayers)
        });

        socketService.hasWon((data) => {
            console.log("server emits : HASWON", data)
            console.log(data)
            if (data.hasWon) {
                setWinner(data.winner)
            }
        })
        
        return (() => {
            socketService.cleanup("server:turn");
            socketService.cleanup("server:timeout");
        })
    }, [])

    // 2 . on correct answer set dice
    const handleCorrectAnswer = (data) => {
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
    const handleMovement = async (area) => {
        let pos = area.id
        
        socketService.makeMove({ rid, pos }, state.pub, (data) => {
            if (data.ok === false) {
                return
            } 
            setCases([])
            setPlayers({
                ...players,
                [user.nickname]: {
                    ...players[user.nickname],
                    position: pos
                }
            })

            console.log("data : ", data);

            if ( data.rollAgain === true ) {
                setDice(true)
                setDiceData(data)
            } else {
                setDice(false)
                startTurn();
            }
            
        })
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
                    {categories.map((category) => (
                        <Grid key={category.name} item xs={4} lg={5}>
                            <Paper
                                elevation={3}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: category.color,
                                }}
                            >
                            <Avatar
                                src={
                                    process.env.PUBLIC_URL +
                                    "/images/category/"
                                    + category.name +
                                    ".png"
                                }
                                alt="Avatar"
                                sx={{ width: "50px", height: "50px" }}
                            />
                            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                        </Paper>
                        </Grid>
                    ))}
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
                    {Object.keys(players).map((key, index) => {
                        return (
                            <Grid container item alignItems="center" sx={{ px: 2 }} key={index}>
                                <Avatar
                                    src={
                                        process.env.PUBLIC_URL +
                                        "/images/cosmetics/cosmetic_" +
                                        players[key].avatar +
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
                                    {key} - Tokens :
                                </Typography>
                                {players[key].tokens.some(cat => cat === true) ?
                                    players[key].tokens.map((cat, index) => {
                                        if (cat)
                                        return (
                                            <Avatar
                                                key={index}
                                                src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/category/" +
                                                    categories[index].name +
                                                    ".png"
                                                }
                                                sx={{
                                                    width: "20px",
                                                    height: "20px",
                                                    mx: 1,
                                                    border: "1px solid " + categories[index].color ,
                                                }}
                                            />
                                        );
                                    })
                                    : 
                                    <Typography variant="body2">
                                        None
                                    </Typography>
                                }
                            </Grid>
                        );
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
                    timer={questionTimeout || 15}
                    onCorrectAnswer={handleCorrectAnswer}
                    onCloseDialog={() => {
                        setQuestion(false)
                    }}
                    pub={state.pub}
                />
            </Dialog>

            <Dialog
                open={!!winner}
                disableEscapeKeyDown
                onClose={(event) => event.preventDefault()}
                onBackdropClick={(event) => event.preventDefault()}
                fullWidth
                maxWidth="lg"
            >
                {winner && <>
                    <DialogTitle>{winner} has won the party</DialogTitle>
                    <DialogContent>
                        He was won with :
                        <ul>
                            {players[winner].correctAnswers.map((cat, index) => {
                                return (
                                    <li key={index}>
                                        {categories[index].name} :
                                        {cat}
                                        /
                                        {players[winner].totalAnswers[index]}
                                    </li>
                                );
                            })}
                        </ul>
                        <br></br>
                        {(user.nickname === winner) && <>
                            But your score is :
                            <ul>
                                {players[user.nickname].correctAnswers.map((cat, index) => {
                                    return (
                                        <li key={index}>
                                            {categories[index].name} :
                                            {cat}
                                            /
                                            {players[user.nickname].totalAnswers[index]}
                                        </li>
                                    );
                                })}
                            </ul>
                        </>}
                        Thanks for playing ! Back to menu
                    </DialogContent>
                    <DialogActions>
                        <Button
                            href="/menu"
                            variant="contained"
                            color="primary"
                        >
                            Back to menu
                        </Button>
                    </DialogActions>
                </>} 
            </Dialog>
        </Grid>
    )
}
