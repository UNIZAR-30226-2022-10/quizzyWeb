/*
 * Author: - Mathis
 * Filename: - solo.js
 * Module: - Game / Solo
 * Description: - Start menu to begin a solo party
 */

import * as React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import Container from "@mui/material/Container"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Dialog from "@mui/material/Dialog"
import DialogContentText from "@mui/material/DialogContentText"
import Grid from "@mui/material/Grid"
import Icon from "@mui/material/Icon"
import Slide from "@mui/material/Slide"
import Typography from "@mui/material/Typography"

import Question from "components/question"

import "css/solo.css"

const difficulties = [
    {
        title: "Easy",
        description: ["Lorem Ipsum"],
        icon: "fa-baby",
    },
    {
        title: "Medium",
        description: ["Lorem Ipsum"],
        icon: "fa-user",
    },
    {
        title: "Hard",
        description: ["Lorem Ipsum"],
        icon: "fa-skull",
    },
]

function Solo() {
    var [start, setStart] = React.useState(false)
    var [difficulty, setDifficulty] = React.useState("Medium")
    const [openResume, setOpenResume] = React.useState(false)
    const [correctAnswer, setCorrectAnswer] = React.useState(0)
    const [wrongAnswer, setWrongAnswer] = React.useState(0)

    function handleStart(e, difficulty) {
        setStart(true)
        setDifficulty(difficulty)
    }
    function handleQuit(e) {
        setOpenResume(true)
    }
    function handleClose(e) {
        setOpenResume(false)
        setStart(false)
        setCorrectAnswer(0)
        setWrongAnswer(0)
    }
    const handleCorrectAnswer = (data) => {
        console.log("Correct " + data.question)
        setCorrectAnswer(correctAnswer + 1)
    }
    const handleWrongAnswer = (data) => {
        console.log("Wrong " + data)
        setWrongAnswer(wrongAnswer + 1)
    }

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />
    })

    if (start === true)
        return (
            <Grid container justifyContent="center">
                <Grid container item justifyContent="end">
                    <Button variant="contained" color="error" onClick={handleQuit}>
                        Quit
                    </Button>
                    <Dialog
                        open={openResume}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <Card>
                            <CardHeader
                                title="Summary of the session"
                                titleTypographyProps={{ align: "left" }}
                                sx={{
                                    textTransform: "capitalize",
                                    backgroundImage:
                                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%);",
                                }}
                            />
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                    Here is a summary of your performance during this
                                    session !
                                </DialogContentText>
                                <ul>
                                    <li>Art : x/10</li>
                                    <li>Entertainement : x/10</li>
                                    <li>Geography : x/10</li>
                                    <li>History : x/10</li>
                                    <li>Science : x/10</li>
                                    <li>Sport : x/10</li>
                                    <li>
                                        Total : {correctAnswer}/
                                        {correctAnswer + wrongAnswer}
                                    </li>
                                </ul>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose}>Ok</Button>
                            </DialogActions>
                        </Card>
                    </Dialog>
                </Grid>
                <Grid container item>
                    <Question
                        difficulty={difficulty}
                        timer={15}
                        onCorrectAnswer={handleCorrectAnswer}
                        onWrongAnswer={handleWrongAnswer}
                    />
                </Grid>
            </Grid>
        )

    return (
        <Container maxWidth="md" component="main">
            <Box my={4}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Juego Solitario
                </Typography>
                <Typography
                    variant="h5"
                    align="center"
                    color="text.secondary"
                    component="p"
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
            </Box>

            <Grid container spacing={5} justifyContent="center">
                {difficulties.map((d) => (
                    // Enterprise card is full width at sm breakpoint
                    <Grid item key={d.title} xs={12} sm={6} md={4}>
                        <Card>
                            <CardHeader
                                className={d.title}
                                title={d.title}
                                titleTypographyProps={{ align: "center" }}
                                action={
                                    <Icon baseClassName="fas" className={d.icon} />
                                }
                                subheaderTypographyProps={{
                                    align: "center",
                                }}
                            />

                            <CardContent>
                                <ul>
                                    {d.description.map((line) => (
                                        <Typography
                                            component="li"
                                            variant="subtitle1"
                                            align="center"
                                            key={line}
                                        >
                                            {line}
                                        </Typography>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardActions>
                                <Button
                                    fullWidth
                                    color="primary"
                                    variant="outlined"
                                    onClick={(e) => handleStart(e, d.title)}
                                >
                                    Start {d.title}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}
export default Solo
