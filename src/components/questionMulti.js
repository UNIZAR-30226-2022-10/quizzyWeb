/*
 * Author: - Mathis
 * Filename: - questionMulti.js
 * Module: - Games
 * Description: - Display a question and the answers from the API
 */

import {useState, useEffect} from 'react';

import {
    Alert,
    Badge,
    Box,
    Button,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Grid,
    LinearProgress,
    Paper,
    Typography,
    Snackbar
} from "@mui/material"

// Query
import {useQuery} from "react-query"

// Services
import userService from "services/userService"

// Socket
import { useSocketContext } from "context/socketContext"

// Custom Components
import { styled } from "@mui/material/styles"

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

export default function QuestionMulti(props) {
    // Props
    const question =  props.question;
    const timer = props.timer;
    // Socket
    const { socketService } = useSocketContext();
    // State
    const [answers, setAnswers] = useState(() => {
        return [
            {string : question.correct_answer}, 
            {string : question.wrong_answer_1}, 
            {string : question.wrong_answer_2}, 
            {string : question.wrong_answer_3}
        ].sort((a,b) => Math.random() - 0.5)
    })
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)
    const [timerInterval, setTimerInterval] = useState(0)
    const [answered, setAnswered] = useState(false)
    const [joker, setJoker] = useState(false)

    // success and error snackbar message
    const [successSnack, setSuccess] = useState(null)
    const [errorSnack, setError] = useState(null)

    const {
        isLoading,
        error,
        data: wildcards,
        refetch: refetchWildcards,
    } = useQuery("wildcards", userService.getWildcards)

    // Handle use of more time joker
    const handleMoreTime = () => {
        setJoker(true)
        userService.useWildcard(2)
            .then(ok => {
                if ( ok ) {
                    // Look up if the user has this kind of jokers.
                    setProgress((oldProgress) => oldProgress - 15000/(timer*10))
                    socketService.moreTime()
                    refetchWildcards();
                }
            })
            .catch(e => {
                if ( e.response.status === 409 ) {
                    setError("¡No tienes comodines suficientes!");
                } else {
                    setError("Error al usar comodín : " + e.message)
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
                    // Select two random element in the array
                    while (wrong_count !== 2 ) {
                        const index = Math.floor(Math.random() * answers.length);
                        if ( answers[index].string !== question.correct_answer ) {
                            answers[index].disabled = true;
                            wrong_count++;
                        }
                    }
                    refetchWildcards();
                }
            })
            .catch(e => {
                if ( e.response.status === 409 ) {
                    setError("¡No tienes comodines suficientes!");
                } else {
                    setError("Error al usar comodín : " + e.message)
                }
            })
    }
   
    // Handle answers
    const handleAnswer = (answer,index) => {
        if (!answered) {
            clearInterval(timerInterval)
            socketService.answerQuestion(answer.string, props.pub, (data) => {
                if (data.ok && !data?.continue === false) {
                    setTimeout(() => {
                        props.onCorrectAnswer(data.roll)
                    }, 3000)
                    answers[index].state = "correct"
                }
                else {
                    answers[index].state = "wrong"
                    answers.forEach((asw) => {
                        if (asw.string === question.correct_answer) {
                            asw.state = "correct"
                        }
                    })
                }
                setAnswered(true)
                setDone(true)
                setTimeout(() => {
                    handleCloseDialog()
                }, 3000)
            })
        }
    }

    // Handle end of question
    const handleCloseDialog = () => {
        clearInterval(timerInterval)
        props.onCloseDialog()
    }

    // Timer
    const tick = 400 //Refresh every X ms
    var diff = tick  / (timer * 10) // diff each tick
    const handleTimer = () => {
        setProgress(0)
        setTimerInterval(
            setInterval(() => {
                setProgress((oldProgress) => {
                    return Math.min(oldProgress + diff, 100)
                })
            }, tick)
        )
    }
 
    // Handle Timeoout
    useEffect(() => {
        // Listen timeout 
        socketService.questionTimeout((data) => {
            console.log("servers emit timeout : ", data)
            setDone(true)
            setAnswered(true)
            displayResp()
        })
        // start timer
        handleTimer()
        // cleanup useeffect
        return () => {
            clearInterval(timerInterval)
        }
    }, [])

    // Detect end of timer
    useEffect(() => {
        if (progress === 100) {
            displayResp()
        }
    }, [progress])

    function displayResp(){
        setDone(true)
            answers.forEach((answer) => {
                if (answer.string === question.correct_answer) {
                    answer.state = "correct"
                } else {
                    answer.state = "wrong"
                }
            })
            clearInterval(timerInterval)
            setTimeout(() => {
                handleCloseDialog()
            }, 3000)
    }

    return (
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
                <Card key="Question">
                    <CardHeader
                        title={question.category_name}
                        subheader={question.difficulty}
                        titleTypographyProps={{ align: "left" }}
                        subheaderTypographyProps={{align: "left"}}
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
                                {question.question}{" "}
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
                            {answers.map(
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
                            onClick={handleCloseDialog}
                            disabled={!done}
                            variant="contained"
                            color="secondary"
                            fullWidth
                        >
                            Back to tablero
                        </Button>
                    </CardActions>
                </Card>
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
                        <Button fullWidth variant="contained" onClick={handleLessAnswers} disabled={wildcards?.wildcards[0].cuantity === 0 || joker}>50/50</Button>
                    </Badge>
                </Grid>
                <Grid container item xs={3} md={12} justifyContent="center">
                    <Badge badgeContent={wildcards?.wildcards[1].cuantity} color="primary">   
                        <Button fullWidth variant="contained" onClick={handleMoreTime} disabled={wildcards?.wildcards[1].cuantity === 0 || joker}>Más tiempo</Button>
                    </Badge>
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
        </Grid>
    )
}