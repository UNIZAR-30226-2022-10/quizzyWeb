/*
 * Author: - Mathis
 * Filename: - question.js
 * Module: - Games
 * Description: - Display a question and the answers from the API
 */

import React, { useState } from "react"

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
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import Badge from "@mui/material/Badge"

import Loader from "./Loader"
import Error from "views/error404"
import userService from "services/userService"

import {
    useQuery,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from "react-query"
import axios from "axios"

import { capitalizeFirstLetter } from "utils/stringService"

const queryClient = new QueryClient({
     defaultOptions: {
     queries: {
       refetchOnWindowFocus: false,
     },
   },
})

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

// WRAPPER FOR THE QUESTION
export default function Question(props) {
    const onCorrectAnswer = (data) => {
        props.onCorrectAnswer(data)
    }
    const onWrongAnswer = (data) => {
        props.onWrongAnswer(data)
    }
    return (
        <QueryClientProvider client={queryClient}>
            <Content
                difficulty={props.difficulty}
                timer={props.timer}
                categories={props.categories}
                onCorrectAnswer={onCorrectAnswer}
                onWrongAnswer={onWrongAnswer}
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

    // one joker for question
    const [useJoker, setJoker] = React.useState(false)

    // success and error snackbar message
    const [successSnack, setSuccess] = useState(null)
    const [errorSnack, setError] = useState(null)

    /* SELECT RANDOM CATEGORY */
    const randomCategory = () => {
        //get random in the categories
        var arr = props.categories[Math.floor(Math.random()*props.categories.length)];
        return arr
    }
    /* API REQUEST */
    const { status, data, error, refetch } = useQuery(
        ["question", props.difficulty, props.timer, props.categories],
        async () => {
            handleTimer()
            let chosenCategory = randomCategory()
            const res = await axios.get(
                process.env.REACT_APP_API_ENDPOINT + "/questions",
                { params: { 
                    limit: 1, 
                    difficulty: props.difficulty.toLowerCase(),
                    category: chosenCategory
                }}
            )
            //get answers in an array and randomize this array
            const answers = shuffle([
                { string: res.data.questions[0].correct_answer, disabled : false },
                { string: res.data.questions[0].wrong_answer_1, disabled : false },
                { string: res.data.questions[0].wrong_answer_2, disabled : false },
                { string: res.data.questions[0].wrong_answer_3, disabled : false },
            ])
            //add answer to res.data.questions[0]
            res.data.questions[0].answers = answers
            return res.data
        }
    )

    const {
        isLoading: wildcardsLoading,
        error: wildcardsError,
        data: wildcards,
        refetch: refetchWildcards,
    } = useQuery("wildcards", userService.getWildcards)

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
        setJoker(false)
        refetch()
    }

    // Handle use of more time joker
    const handleMoreTime = () => {

        setJoker(true)

        userService.useWildcard(2)
            .then(ok => {
                if ( ok ) {
                    // Look up if the user has this kind of jokers.
                    setProgress((oldProgress) => oldProgress - 15000/(intervalS*10)) 
                    refetchWildcards();
                }
            })
            .catch(e => {
                if ( e.response.status === 409 ) {
                    setError("??No tienes comodines suficientes!");
                } else {
                    setError("Error al usar comod??n : " + e.message)
                }
            })
    }

    // Handle use of less answers joker
    const handleLessAnswers = () => {

        setJoker(true)

        userService.useWildcard(1)
            .then(ok => {
                if ( ok ) {
                    // Look up if the user has this kind of jokers.
                    let wrong_count = 0;
                    data.questions[0].answers.forEach((answer) => {
                        if (answer.string !== data.questions[0].correct_answer && wrong_count < 2) {
                            answer.disabled = true;
                            wrong_count++;
                        }
                    })
                    refetchWildcards();
                }
            })
            .catch(e => {
                if ( e.response.status === 409 ) {
                    setError("??No tienes comodines suficientes!");
                } else {
                    setError("Error al usar comod??n : " + e.message)
                }
            })
    }

    // Called when the compoonent is unmounted
    React.useEffect(() => {
        if (progress === 100) {
            setReadyNext(true)
            data.questions[0].answers.forEach((answer) => {
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
                                                                disabled={answer.disabled}
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
                            <Badge badgeContent={wildcards?.wildcards[0].cuantity} color="primary">
                                <Button fullWidth variant="contained" onClick={handleLessAnswers} disabled={wildcards?.wildcards[0].cuantity === 0 || useJoker || answered || readyNext}>50/50</Button>
                            </Badge>
                        </Grid>
                        <Grid container item xs={3} md={12} justifyContent="center">
                            <Badge badgeContent={wildcards?.wildcards[1].cuantity} color="primary">   
                                <Button fullWidth variant="contained" onClick={handleMoreTime} disabled={wildcards?.wildcards[1].cuantity === 0 || useJoker || answered || readyNext}>M??s tiempo</Button>
                            </Badge>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Success snackbar */}
                <Snackbar
                    open={successSnack !== null}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(null)}
                >
                    <Alert
                        onClose={() => setSuccess(null)}
                        severity="success"
                        sx={{ width: "100%" }}
                    >
                        {successSnack}
                    </Alert>
                </Snackbar>
                {/* Error snackbar */}
                <Snackbar
                    open={errorSnack !== null}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                >
                    <Alert
                        onClose={() => setError(null)}
                        severity="error"
                        sx={{ width: "100%" }}
                    >
                        {errorSnack}
                    </Alert>
                </Snackbar>
            </Container>
        </QueryClientProvider>
    )
}
