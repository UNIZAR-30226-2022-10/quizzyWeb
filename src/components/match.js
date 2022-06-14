import { useTheme } from '@emotion/react'
import { 
    Grid,
    Paper, 
    Typography,
    GridIte,
    Button
} from '@mui/material'
import React from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useSocketContext } from 'context/socketContext';

function Match({match, pub, onResume}) {

    const { socket, socketService } = useSocketContext();

    const handleEnterGame = (e, id) => {
        e.preventDefault();
        
        // resume match
        socketService.resumeGame(match.rid, pub, onResume)
    }

    return (
        <div
            style={{
                width: "100%",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column"
            }}
        >
            <Paper
                sx={{
                    padding: "1rem",
                    width: "100%",
                    borderRadius: "5px 5px 0 0",
                    backgroundColor: "primary.main",
                    color: "white",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1
                }}
            >
                <Typography 
                    sx={{ 
                        fontWeight: 'bold',
                    }}
                >
                    Sala {match.rid}
                </Typography>
                <Typography>
                    {match.users.length} jugadores
                </Typography>
                <Button 
                    variant="contained"
                    color="secondary"
                    onClick={(e) => handleEnterGame(e, match.rid)}
                    endIcon={<PlayCircleIcon />}
                >
                    Entrar
                </Button>
            </Paper>
            <Paper
                sx={{
                    padding: "1rem",
                    width: "100%",
                    backgroundColor: "secondary.main",
                    borderRadius: "0 0 5px 5px",
                    flex: 4,
                    color: "white"
                }}
            >
                <Grid 
                    container 
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    spacing={2}
                    width="100%"
                >
                    {match.users.map(
                        (item, key) => (
                            <Grid key={key} item xs={4} >
                                <Paper
                                    sx={{
                                        backgroundColor: "secondary.light",
                                        padding: "0.5rem",
                                        color: "white"
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "small"
                                        }}
                                    >
                                        Jugador {key + 1} : {item.nickname}
                                    </Typography>
                                </Paper>
                            </Grid>
                        )
                    )}
                </Grid>
            </Paper>
        </div>
    )
}

export default Match