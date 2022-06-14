/*
 * Author: - Mathis
 * Filename: - questionMulti.js
 * Module: - Games
 * Description: - Display a question and the answers from the API
 */

import * as React from 'react';

import {
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
} from "@mui/material"
// Socket
import { useSocketContext } from "context/socketContext"
// CUSTOM COMPONENTS
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
    const [answers, setAnswers] = React.useState(() => {
        return [
            {string : question.correct_answer}, 
            {string : question.wrong_answer_1}, 
            {string : question.wrong_answer_2}, 
            {string : question.wrong_answer_3}
        ].sort((a,b) => Math.random() - 0.5)
    })
    const [progress, setProgress] = React.useState(0)
    const [done, setDone] = React.useState(false)
    const [timerInterval, setTimerInterval] = React.useState(0)
    const [answered, setAnswered] = React.useState(false)

   
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
    var diff = (tick * 100) / (timer * 1000) // diff each tick
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
    React.useEffect(() => {
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
    React.useEffect(() => {
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
    )
}