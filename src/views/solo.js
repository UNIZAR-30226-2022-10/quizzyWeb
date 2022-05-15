/*
 * Author: - Mathis
 * Filename: - solo.js
 * Module: - Game / Solo
 * Description: - Start menu to begin a solo party
 */

import * as React from 'react';
import { styled } from '@mui/material/styles';

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import Container from "@mui/material/Container"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import Dialog from "@mui/material/Dialog"
import DialogContentText from "@mui/material/DialogContentText"
import Grid from "@mui/material/Grid"
import Icon from "@mui/material/Icon"
import Slide from "@mui/material/Slide"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import Typography from "@mui/material/Typography"

import Question from "components/question"

import "css/solo.css"
import {capitalizeFirstLetter} from "utils/stringService"

const DifficultyToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
        '&.Mui-disabled': {
            border: 0,
        },
        '&.Mui-selected': {
            fontWeight: 'bold',
            '&:not(:first-of-type)': {
                backgroundColor: '#ffffba'
            },
            '&:last-of-type': {
                backgroundColor: '#ffb3ba'
            },
            '&:first-of-type': {
                backgroundColor: '#baffc9'
            },
            color: 'black'
        },  
    },
  }));
const TimerToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
        margin: theme.spacing(0.5),
        border: 0,
        '&:not(:first-of-type)': {
            borderRadius: theme.shape.borderRadius,
        },
        '&:first-of-type': {
            borderRadius: theme.shape.borderRadius,
        },
        '&.Mui-disabled': {
            border: 0,
        },
        '&.Mui-selected': {
            fontWeight: 'bold',
            backgroundColor:'#bae1ff',
            color: 'black'
        },  
    },
  }));

function Solo() {
    var [start, setStart] = React.useState(false)
    var [difficulty, setDifficulty] = React.useState('medium')
    var [categories, setCategories] = React.useState({
        History: true, 
        Science: true,
        Geography: true,
        Sports: true,
        Entertainment: true,
        Art: true,
    })
    var [timer, setTimer] = React.useState('15')
    const [openResume, setOpenResume] = React.useState(false)
    const [answer, setAnswer] = React.useState({
        History: [0,0], 
        Science: [0,0],
        Geography: [0,0],
        Sports: [0,0],
        Entertainment: [0,0],
        Art: [0,0],
        Total: [0,0],
    })

    function handleStart(e) {
        setTimer(Number(timer))
        setStart(true)
    }
    function handleQuit(e) {
        setOpenResume(true)
    }
    function handleClose(e) {
        setOpenResume(false)
        setStart(false)
        setTimer(String(timer))
        //reset answer
        setAnswer({
            History: [0,0],
            Science: [0,0],
            Geography: [0,0],
            Sports: [0,0],
            Entertainment: [0,0],
            Art: [0,0],
            Total: [0,0],
        })
    }
    const handleCorrectAnswer = (data) => {
        switch (data.category_name) {
            case "History":
                setAnswer(answer => ({
                    ...answer,
                    History: [answer.History[0] + 1, answer.History[1] + 1],
                }))
                break
            case "Science":
                setAnswer(answer => ({
                    ...answer,
                    Science: [answer.Science[0] + 1, answer.Science[1] + 1],
                }))
                break
            case "Geography":
                setAnswer(answer => ({
                    ...answer,
                    Geography: [answer.Geography[0] + 1, answer.Geography[1] + 1],
                }))
                break
            case "Sports":
                setAnswer(answer => ({
                    ...answer,
                    Sports: [answer.Sports[0] + 1, answer.Sports[1] + 1],
                }))
                break
            case "Entertainment":
                setAnswer(answer => ({
                    ...answer,
                    Entertainment: [answer.Entertainment[0] + 1, answer.Entertainment[1] + 1],
                }))
                break
            case "Art":
                setAnswer(answer => ({
                    ...answer,
                    Art: [answer.Art[0] + 1, answer.Art[1] + 1],
                }))
                break
            default:
                break
        }
        setAnswer(answer => ({
            ...answer,
            Total: [answer.Total[0] + 1, answer.Total[1] + 1],
        }))
    }
    const handleWrongAnswer = (data) => {
        switch (data.category_name) {
            case "History":
                setAnswer(answer => ({
                    ...answer,
                    History: [answer.History[0] , answer.History[1] + 1],
                }))
                break
            case "Science":
                setAnswer(answer => ({
                    ...answer,
                    Science: [answer.Science[0], answer.Science[1] + 1],
                }))
                break
            case "Geography":
                setAnswer(answer => ({
                    ...answer,
                    Geography: [answer.Geography[0], answer.Geography[1] + 1],
                }))
                break
            case "Sports":
                setAnswer(answer => ({
                    ...answer,
                    Sports: [answer.Sports[0], answer.Sports[1] + 1],
                }))
                break
            case "Entertainment":
                setAnswer(answer => ({
                    ...answer,
                    Entertainment: [answer.Entertainment[0], answer.Entertainment[1] + 1],
                }))
                break
            case "Art":
                setAnswer(answer => ({
                    ...answer,
                    Art: [answer.Art[0], answer.Art[1] + 1],
                }))
                break
            default:
                break
        }
        setAnswer(answer => ({
            ...answer,
            Total: [answer.Total[0], answer.Total[1] + 1],
        }))
    }
    const handleDifficulty = (event,data) => {
        if (data !== null) {
            setDifficulty(data)
        }
    }
    const handleTimer = (event,data) => {
        if (data !== null) {
            setTimer(data)
        }
    }
    const handleCategory = (data) => {
        // if data in categories is true, set to false
        // else set to true
        setCategories({
            ...categories,
            [data]: !categories[data]
        })
    }
    const chosenCategory = () => {
        let chosenCategory = []
        //if element is true push element to array
        for (let key in categories) {
            if (categories[key]) {
                chosenCategory.push(key)
            }
        }
        return chosenCategory
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
                    {/* SUMMARY */}
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
                                    {Object.keys(answer).map((item) => (
                                        <li key={item}>
                                            {capitalizeFirstLetter(item)} 
                                            {': '}
                                            {answer[item][0]} / {answer[item][1]}
                                        </li>
                                    ))}
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
                        categories={chosenCategory()}
                        timer={timer}
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
                    Unselect the categories you don't want to play with 
                    and the difficulty of the questions you want to answer 
                    and the maximum response time !
                </Typography>
            </Box>
            <Grid container rowSpacing={1}>
                {/* Categories*/}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
                    Categories: 
                </Typography>
                <Grid container item justifyContent="center" spacing={1}>
                    {Object.keys(categories).map((item) => (
                        <Grid item xs={4} md={2} key={item}>
                            <Card 
                                sx={{   opacity: categories[item]? '1' : '0.4', 
                                        backgroundColor: categories[item]? '#fff' : '#C0C1B7',
                                    }}>
                                <CardActionArea onClick={() => {handleCategory(item)}}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={require(process.env.PUBLIC_URL + "/images/category/"+item.toLowerCase()+".png")}
                                        alt={item}
                                    />
                                    <CardContent sx={{textAlign:'center'}}>
                                        <Typography variant="h6" gutterBottom component="div">
                                            {capitalizeFirstLetter(item)}
                                        </Typography> 
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* Difficulty & Timer*/}
                <Grid container item justifyContent="space-between">
                    {/* Difficulty*/}
                    <Grid container item xs={12} md={6} justifyContent="center">
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{
                                display:'flex',
                                alignItems:'center'
                                ,marginRight:'8px',
                                fontWeight:'bold'
                            }}
                        >
                            Difficulty : 
                        </Typography>
                        <DifficultyToggleButtonGroup
                            color='primary'
                            value={difficulty}
                            exclusive
                            onChange={handleDifficulty}
                            aria-label="choose difficulty"
                        >
                            <ToggleButton value="easy" aria-label="easy">
                                <Icon baseClassName="fas" className='fa-baby'/> Easy
                            </ToggleButton>
                            <ToggleButton value="medium" aria-label="medium">
                                <Icon baseClassName="fas" className='fa-user'/> Medium
                            </ToggleButton>
                            <ToggleButton value="hard" aria-label="hard">
                                <Icon baseClassName="fas" className='fa-skull'/> Hard
                            </ToggleButton>
                        </DifficultyToggleButtonGroup>
                    </Grid>
                    {/* Timer*/}
                    <Grid container item xs={12} md={6} justifyContent="center">
                        <Typography variant="h6" component="div" sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
                            Response time : 
                        </Typography>
                        <TimerToggleButtonGroup
                            color="primary"
                            value={timer}
                            exclusive
                            onChange={handleTimer}
                            aria-label="choose maximum response time "
                        >
                            <ToggleButton value="10" aria-label="10">
                                10s
                            </ToggleButton>
                            <ToggleButton value="15" aria-label="15">
                                15s
                            </ToggleButton>
                            <ToggleButton value="20" aria-label="20">
                                20s
                            </ToggleButton>
                            <ToggleButton value="30" aria-label="30">
                                30s
                            </ToggleButton>
                        </TimerToggleButtonGroup>
                    </Grid>

                </Grid>
                {/* Start button*/}
                <Grid container item justifyContent="center">
                    {/* Difficulty*/}
                    <Button variant="contained" size="large" onClick={handleStart}>
                        Start
                    </Button>
                </Grid>
            </Grid>
        </Container>
    )
}
export default Solo
