/*
 * Author: - Mathis
 * Filename: - question.js
 * Module: - Games
 * Description: - Display a question and the answers from the API
 */

import React from "react"

import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import { Container } from "@mui/material"
import Paper from "@mui/material/Paper"
import LinearProgress from "@mui/material/LinearProgress"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"

import Loader from "./Loader"
import Error from "views/error404"

import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "react-query"
import axios from "axios"

import { capitalizeFirstLetter } from "services/stringService"

const queryClient = new QueryClient()

//FUNCTIONS
//randomize an array
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

//CUSTOM COMPONENTS
const CustomLinearProgress = styled(LinearProgress)({
    height: "15px",
    borderRadius: "20px",
    transform: "rotate(180deg)",
    background:
        "linear-gradient(90deg, rgba(1,213,0,1) 0%,rgba(236,102,0,1) 84%, rgba(199,0,0,1) 100%)",
    "& .MuiLinearProgress-bar": {
        backgroundColor: "#000000",
        backgroundImage: "linear-gradient(315deg, #000000 0%, #414141 74%)",
    },
})
const CustomBox = styled(Box)({
    backgroundImage:
        "linear-gradient(to right, #757F9A 0%, #D7DDE8  51%, #757F9A  100%)",
    transition: "0.3s",
    height: "100%",
    m: 4,
    borderRadius: "10px",
    "&:hover": {
        backgroundPosition:
            "right center" /* change the direction of the change here */,
        color: "#fff",
        boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    },
})

// WRAPPER FOR THE QUESTION
export default function Question(props) {
    const testonCorrectAnswer = (data) => {
        props.onCorrectAnswer(data)
    }
    const testonWrongAnswer = (data) => {
        props.onWrongAnswer(data)
    }
    return (
        <QueryClientProvider client={queryClient}>
            <Content
                difficulty={props.difficulty}
                timer={props.timer}
                onCorrectAnswer={testonCorrectAnswer}
                onWrongAnswer={testonWrongAnswer}
            />
        </QueryClientProvider>
    )
}

function Content(props) {
    const queryClient = useQueryClient()
    const [intervalS, setIntervalMs] = React.useState(props.timer)
    const [progress, setProgress] = React.useState(0)
    const [readyNext, setReadyNext] = React.useState(false)
    const [timer, setTimer] = React.useState(0)
    const [answered, setAnswered] = React.useState(false)
    const { status, data, error, refetch } = useQuery(
        ["question", props.difficulty, props.timer],
        async () => {
            handleTimer()
            const res = await axios.get(
                process.env.REACT_APP_API_ENDPOINT + "/questions",
                { params: { limit: 1, difficulty: props.difficulty.toLowerCase() } }
            )
            //get answers in an array and randomize this array
            const anwsers = shuffle([
                { string: res.data.questions[0].correct_answer },
                { string: res.data.questions[0].wrong_answer_1 },
                { string: res.data.questions[0].wrong_answer_2 },
                { string: res.data.questions[0].wrong_answer_3 },
            ])
            //add answer to res.data.questions[0]
            res.data.questions[0].answers = anwsers
            return res.data
        }
    )

    // Timer
    const tick = 400 //Refresh every X ms
    var diff = (tick * 100) / (intervalS * 1000) // diff each tick
    const handleTimer = () => {
        setProgress(0)
        setTimer(
            setInterval(() => {
                setProgress((oldProgress) => {
                    return Math.min(oldProgress + diff, 100)
                })
            }, tick)
        )
    }

    // Handle answers
    const handleAnswer = (answer, index) => {
        if (!answered) {
            if (answer.string === data.questions[0].correct_answer) {
                props.onCorrectAnswer(data.questions[0])
                clearInterval(timer)
                data.questions[0].answers[index].state = "correct"
            } else {
                props.onWrongAnswer(data.questions[0])
                clearInterval(timer)
                data.questions[0].answers[index].state = "wrong"
                data.questions[0].answers.forEach((answer) => {
                    if (answer.string === data.questions[0].correct_answer) {
                        answer.state = "correct"
                    }
                })
            }
            clearInterval(timer)
            setReadyNext(true)
            setAnswered(true)
        }
    }
    // Handle next question
    const handleNextQuestion = () => {
        setReadyNext(false)
        setAnswered(false)
        clearInterval(timer)
        refetch()
    }

    // Called when the compoonent is unmounted
    React.useEffect(() => {
        if (progress === 100) {
            setReadyNext(true)
            data.questions[0].answers.map((answer) => {
                if (answer.string === data.questions[0].correct_answer) {
                    answer.state = "correct"
                } else {
                    answer.state = "wrong"
                }
            })
            clearInterval(timer)
        }
    }, [progress])

    // ERROR QUERY GESTION
    if (status === "loading") return <Loader />
    if (status === "error") return <Error message={error.message} />

    return (
        <QueryClientProvider client={queryClient}>
            <Container maxWidth="lg">
                {/* PARAMETERS */}
                <Grid item>
                    <p>Difficulty is set to : {props.difficulty}</p>
                    <label>
                        Time available (s):{" "}
                        <input
                            value={intervalS}
                            onChange={(ev) => setIntervalMs(Number(ev.target.value))}
                            type="number"
                        />{" "}
                    </label>
                </Grid>
                {/* MAIN */}
                <Grid container justifyContent="space-between">
                    {/*QUESTION & ANSWERS*/}
                    <Grid
                        item
                        xs={12}
                        md={9}
                        sx={{
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            borderRadius: "10px",
                            background: "#eee",
                        }}
                    >
                        <>
                            {data.questions.map((item) => (
                                <>
                                    <Card key="Question">
                                        <CardHeader
                                            title={item.category_name}
                                            subheader={capitalizeFirstLetter(
                                                item.difficulty
                                            )}
                                            titleTypographyProps={{ align: "left" }}
                                            subheaderTypographyProps={{
                                                align: "left",
                                            }}
                                            sx={{
                                                textTransform: "capitalize",
                                                backgroundImage:
                                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
                                            }}
                                        />

                                        <CardContent>
                                            <Paper
                                                elevation={3}
                                                sx={{
                                                    overflow: "hidden",
                                                    mb: 2,
                                                    width: "100%",
                                                    borderRadius: "20px",
                                                }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    sx={{ p: 2 }}
                                                >
                                                    {item.question}{" "}
                                                </Typography>
                                                {/* TIMER */}
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CustomLinearProgress
                                                        variant="determinate"
                                                        value={progress}
                                                    />
                                                </Box>
                                            </Paper>

                                            <Grid container spacing={2}>
                                                {item.answers.map(
                                                    (answer, index) => (
                                                        <Grid
                                                            item
                                                            xs={6}
                                                            key={index}
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color={
                                                                    answer.state
                                                                        ? answer.state ===
                                                                          "correct"
                                                                            ? "success"
                                                                            : "error"
                                                                        : "secondary"
                                                                }
                                                                align="center"
                                                                fullWidth
                                                                sx={{
                                                                    color: "white",
                                                                }}
                                                                onClick={() =>
                                                                    handleAnswer(
                                                                        answer,
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                {answer.string}
                                                            </Button>
                                                        </Grid>
                                                    )
                                                )}
                                            </Grid>
                                        </CardContent>

                                        <CardActions>
                                            <Button
                                                onClick={handleNextQuestion}
                                                disabled={!readyNext}
                                                variant="contained"
                                                color="success"
                                                fullWidth
                                            >
                                                Next Question
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </>
                            ))}
                        </>
                    </Grid>
                    {/*BONUS*/}
                    <Grid
                        container
                        item
                        xs={12}
                        md={2}
                        justifyContent="space-around"
                        alignItems="center"
                        sx={{
                            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            borderRadius: "10px",
                            margin: "8px",
                            background: "#eee",
                        }}
                    >
                        <Grid container item xs={3} md={12} justifyContent="center">
                            <Button variant="contained">Bonus 1</Button>
                        </Grid>
                        <Grid container item xs={3} md={12} justifyContent="center">
                            <Button variant="contained">Bonus 2</Button>
                        </Grid>
                        <Grid container item xs={3} md={12} justifyContent="center">
                            <Button variant="contained">Bonus 3</Button>
                        </Grid>
                        <Grid container item xs={3} md={12} justifyContent="center">
                            <Button variant="contained">Bonus 4</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </QueryClientProvider>
    )
}
