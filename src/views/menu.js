import React, { useState, useEffect } from 'react'
import {
    Container,
    Paper,
    Tabs,
    Tab,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField,
    Typography,
    Icon,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
} from "@mui/material"

import { useNavigate } from "react-router-dom"
import CardMedia from "@mui/material/CardMedia"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"

import {capitalizeFirstLetter} from "utils/stringService"

import theme from '../utils/theme';
import { 
    disconnectSocket, 
    initSocket, 
    joinPublicMatch,
    leavePublicMatch
} from 'services/sioService'

export default function Menu() {

    var [game, setGame] = React.useState({
        Partida_1: true, 
        Partida_2: true,
        Partida_3: true,
        Partida_4: true,
        Partida_5: true,
        Partida_6: true,
    })

    const handleGame = (data) => {
        // if data in the game is true, set to false
        // else set to true
        setGame({
            ...game,
            [data]: !game[data]
        })
    }

    let navigate = useNavigate()
    function handleGames(e) {
        navigate("/games", { replace: false })
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1rem",
                mt: 2,
            }}
        >
            {/* Nueva Partida */}
            
                <Button
                    variant="contained"
                    onClick={handleGames}
                    color="primary"
                    size="large"
                    sx={{
                        width: "50%",
                        alignSelf: "center",
                        borderRadius: "10px",
                        height: "70px"
                    }}
                    startIcon={
                        <Icon baseClassName="fas" className="fa-circle-plus" />
                    }
                >
                    Nueva Partida
                </Button>
            

            {/* MULTI */}
            <Paper
                sx={{
                    marginBlockStart: "20px",
                    display: "flex",
                    flexDirection: "column",
                    width : "50%",
                    mx: "auto",
                    gap: "0.5em",
                    p: 2,
                    borderRadius: "20px",
                    backgroundColor: theme.palette.primary.main,
                }}
            >
                <Typography
                    variant="h4"
                    component="div"
                    sx={{ 
                        m: 2,
                        color: "white",
                        alignSelf: "center",
                    }}
                >
                    Esperando Turno
                </Typography>
                <Grid container item justifyContent="center" spacing={2} display="flex" flexDirection="column" flexWrap="row wrap">
                    {Object.keys(game).map((item) => (
                        <Grid item xs={20} md={20} key={item}>
                            <Card 
                                sx={{   opacity: game[item]? '1' : '0.4', 
                                        backgroundColor: game[item]? '#fff' : '#C0C1B7',
                                }}>
                                <CardActionArea onClick={() => {handleGames(item)}}>
                                    <CardMedia
                                        height="140"
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
            </Paper>
        </Container>
    )
}
