/*
 * Author: - Diana
 * Filename: - multiPriv.js
 * Module: - Game / Multi / Priv
 * Description: - Start menu to begin a multi party
 */
import * as React from 'react'

import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import ToggleButton from "@mui/material/ToggleButton"
import Icon from "@mui/material/Icon"
import { styled } from '@mui/material/styles';
import CardActionArea from "@mui/material/CardActionArea"
import CardMedia from "@mui/material/CardMedia"

import Chat from "../components/chat/chat"
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


function MultiPublic() {

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

    const [jugadores] = React.useState([
        "Jugador1",
        "Jugador2",
        "Jugador3",
        "Jugador4",
        "Jugador5",
        "Jugador6"
    ])

    function handleStart(e) {
        setStart(true)
    }

    function handlePlayers(e) {
        
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

    //if (start == true) <- go to board (game)

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
                Juego Multijugador
            </Typography>
        </Box>

        <div
            style = {{
                display: "flex"
            }}>
                {/* Chat*/}
                <div>
                    <Chat></Chat>
                </div>
                {/* Players*/}
                <div>
                <Paper
                elevation={5}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    mb: 2,
                    p: 2,
                    borderRadius: "20px",
                }}
                >
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
                        Jugadores: 
                    </Typography>
                    {/* Players */}
                    <Grid container item justifyContent="center" spacing={0.2} flexDirection="column" >
                        {Object.keys(jugadores).map((item) => (
                            <Grid item xs={20} md={24} key={item}>
                                <Card 
                                    sx={{   opacity: jugadores[item]? '1' : '0.4',
                                            backgroundColor: jugadores[item]? '#fff' : '#C0C1B7',
                                        }}>
                                    <CardContent sx={{textAlign:'center'}}>
                                        <Typography variant="h6" gutterBottom component="div">
                                            {capitalizeFirstLetter(jugadores[item])}
                                        </Typography> 
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </div>
            {/* Categories & Difficulty & Timer*/}
            <div>
            <Paper
                elevation={5}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    mb: 2,
                    p: 2,
                    borderRadius: "20px",
                }}
                >
                {/* Categories */}
                <Grid container rowSpacing={1}>
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
                    {/* Categories*/}
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
                        Categories: 
                    </Typography>
                    <Grid container item justifyContent="center" spacing={1} display="flex" flexWrap="row wrap">
                        {Object.keys(categories).map((item) => (
                            <Grid item xs={6} md={4} key={item}>
                                <Card 
                                    sx={{   opacity: categories[item]? '1' : '0.4', 
                                            backgroundColor: categories[item]? '#fff' : '#C0C1B7',
                                    }}>
                                    <CardActionArea onClick={() => {handleCategory(item)}}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={process.env.PUBLIC_URL+"/images/category/"+item+".png"}
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
                </Grid>
                <Grid container item justifyContent="space-between">
                    {/* Difficulty*/}
                    <Grid container item xs={12} md={6} justifyContent="center" flexDirection="column">
                    <Typography variant="h6" component="div" sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
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
                </Paper>
            </div>
        </div> 
        <div align="center" display="flex" flexDirection="column">
            {/* Invite button*/}
            <Button variant="contained" display="inline-block" size="large" onClick={handlePlayers}>
                + Invitar amigos
            </Button>
            
            {/* Start button*/}
            <Button variant="contained" display="inline-block" size="large" onClick={handleStart}>
                Start
            </Button>
        </div>
    </Container>
        
  )
}



export default MultiPublic