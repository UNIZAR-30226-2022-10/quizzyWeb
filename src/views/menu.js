import React, { useState, useEffect } from 'react'
import {
    Container,
    Paper,
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
    CardMedia,
    Card,
    CardActionArea,
    CardContent,
    Grid,
} from "@mui/material"

import Match from 'components/match';

import { useQuery } from "react-query"

import { useNavigate } from "react-router-dom"
import gamesService from 'services/gamesService'

import {capitalizeFirstLetter} from "utils/stringService"

import theme from '../utils/theme';
import { useSocketContext } from 'context/socketContext'

export default function Menu() {

    let navigate = useNavigate()
    function handleGames(e) {
        navigate("/games", { replace: false })
    }

    const {
        isLoading: publicGamesLoading,
        error: publicGamesError,
        data: publicGames,
        refetch: refetchPublicGames,
    } = useQuery("publicGames", gamesService.getPublicGames);

    const {
        isLoading: privateGamesLoading,
        error: privateGamesError,
        data: privateGames,
        refetch: refetchPrivateGames,
    } = useQuery("privateGames", gamesService.getPrivateGames)

    const {
        isLoading: invitesLoading,
        error: invitesError,
        data: invites,
        refetch: refetchInvites,
    } = useQuery("invites", gamesService.getInvites)

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1rem",
                mt: 2,
            }}
            maxWidth="lg"
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
            
            <div 
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: "2rem",
                }}
            >
                <Paper
                    sx={{
                        flex: 1,
                        marginBlockStart: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mx: "auto",
                        gap: "0.5em",
                        p: 2,
                        borderRadius: "20px",
                        backgroundColor: theme.palette.primary.main,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ 
                            m: 2,
                            color: "white",
                        }}
                    >
                        Partidas públicas
                    </Typography>
                    <Grid container item justifyContent="center" spacing={2} display="flex" flexDirection="column" flexWrap="row wrap">
                        {!publicGamesLoading && !publicGamesError && publicGames.games.map((item) => (
                            <Match match={item} />
                        ))}
                    </Grid>
                </Paper>
                <Paper
                    sx={{
                        flex: 1,
                        marginBlockStart: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mx: "auto",
                        gap: "0.5em",
                        p: 2,
                        borderRadius: "20px",
                        backgroundColor: theme.palette.primary.main,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ 
                            m: 2,
                            color: "white",
                        }}
                    >
                        Partidas privadas
                    </Typography>
                    <Grid container item justifyContent="center" spacing={2} display="flex" flexDirection="column" flexWrap="row wrap">
                        {!privateGamesLoading && !privateGamesError && privateGames.games.map((item) => (
                            <Match match={item}/>
                        ))}
                    </Grid>
                </Paper>
                <Paper
                    sx={{
                        flex: 1,
                        marginBlockStart: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mx: "auto",
                        gap: "0.5em",
                        p: 2,
                        borderRadius: "20px",
                        backgroundColor: theme.palette.primary.main,
                    }}
                >
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ 
                            m: 2,
                            color: "white",
                        }}
                    >
                        Invitaciones
                    </Typography>
                    <Grid container item justifyContent="center" spacing={2} display="flex" flexDirection="column" flexWrap="row wrap">
                        {!publicGamesLoading && !publicGamesError && publicGames.games.map((item) => (
                            <Grid item xs={20} md={20} key={item}>
                                <Card>
                                    <CardActionArea onClick={() => {handleGames(item)}}>
                                        <CardMedia
                                            height="140"
                                            alt={item}
                                        />
                                        <CardContent sx={{textAlign:'center'}}>
                                            <Typography variant="h6" gutterBottom component="div">
                                                {item.rid}
                                            </Typography> 
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </div>
        </Container>
    )
}
