/*
 * Author: - Diana
 * Filename: - multiPublic.js
 * Module: - Game / Multi / Public
 * Description: - Start menu to begin a multi party
 */
import * as React from 'react'
import { useNavigate, useParams} from 'react-router-dom'

import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

import Chat from "../components/chat/chat"

import { useSocketContext } from "context/socketContext"
import userService from "services/userService"

function MultiPublic() {
    let navigate = useNavigate();
    let rid = useParams().rid;

    const { socketService } = useSocketContext();

    const [counter, setCounter] = React.useState(5)
    const [jugadores, setJugadores] = React.useState({})
    const [timer, setTimer] = React.useState(null)
    const timerRef = React.useRef(timer);
    timerRef.current = timer;
    const jugadoresRef = React.useRef(jugadores);
    jugadoresRef.current = jugadores;

    const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"]
    // Listen if the game is ready to start
    React.useEffect(async () => {
        await socketService.turn((args) => {
            console.log("Turn received");
            // Get player information
            const playersData = args.stats
            Object.keys(args.stats).map( async (key,index) => {
                await userService.searchUsers(key)
                    .then((res) => {
                        const user = res.data.results[0]
                        playersData[key] = {
                            ...playersData[key],
                            cosmetic: user.actual_cosmetic
                        }
                    }
                )
            })
            setJugadores(playersData)
            setTimer(args.timer/1000)
        })
        // decrease from 5 to 0 
        let interval = setInterval(() => {
            setCounter(prevState => Math.max(prevState - 1,0))
        }, 1000)
        // go to tablero
        let timeout = setTimeout(() => {
            const players = jugadoresRef.current
            navigate(`/tablero/${rid}`, { state: {players, timer: timerRef.current , pub : true} });
        }, 5000);
        

        // useeffect to clean up
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        }
    }, [])

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
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{display:'flex',alignItems:'center',marginRight:'8px',fontWeight:'bold'}}>
                        Jugadores: 
                    </Typography>
                    {/* Players */}
                    <Grid container item justifyContent="center" spacing={0.2} flexWrap="wrap" >
                        {Object.keys(jugadores).map((key,index) => (
                            <Grid item xs={20} md={24} key={key}>
                                <Card>
                                    <CardContent sx={{display:'flex', wrap: 'nowrap'}}>
                                        <Avatar
                                            src={process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + jugadores[key].cosmetic + ".jpg"}
                                            sx={{mr:1, border: `3px solid ${colors[index]}`}}
                                        />
                                        <Typography variant="h6" gutterBottom component="div">
                                            {key}
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
            <Button variant="contained" size="large">
                Game will start in {counter} seconds
            </Button>
        </Grid>
    </Container>
        
  )
}



export default MultiPublic