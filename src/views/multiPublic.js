/*
 * Author: - Diana
 * Filename: - multiPublic.js
 * Module: - Game / Multi / Public
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

import Chat from "../components/chat/chat"

import {capitalizeFirstLetter} from "utils/stringService"


function MultiPublic() {
    

    var [start, setStart] = React.useState(false)

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
                display: "flex",
                columnGap: "160px"
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
                    <h1>Jugadores</h1>
                    <Grid container item justifyContent="center" spacing={1} flexDirection="column">
                        {Object.keys(jugadores).map((item) => (
                            <Grid item xs={4} md={24} key={item}>
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
        </div> 

        {/* Start button*/}
        <Grid container item justifyContent="center">
            <Button variant="contained" size="large" onClick={handleStart}>
                Start
            </Button>
        </Grid>
    </Container>
        
  )
}



export default MultiPublic