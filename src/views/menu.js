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

import { useQuery } from "react-query"

import { useNavigate } from "react-router-dom"
import CardMedia from "@mui/material/CardMedia"
import Card from "@mui/material/Card"
import CardActionArea from "@mui/material/CardActionArea"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"

import gamesService from 'services/gamesService'

import {capitalizeFirstLetter} from "utils/stringService"

import theme from '../utils/theme';
import { useSocketContext } from 'context/socketContext'

export default function Menu() {

    var [games, setGames] = React.useState([])

    let navigate = useNavigate()
    function handleGames(e) {
        navigate("/games", { replace: false })
    }

    const {
        isLoading: publicGamesLoading,
        error: publicGamesError,
        data: publicGames,
        refetch: refetchPublicGames,
    } = useQuery("publicGames", gamesService.getPublicGames)

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
                    {games.map((item) => (
                        <Grid item xs={20} md={20} key={item}>
                            <Card>
                                <CardActionArea onClick={() => {handleGames(item)}}>
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
        </Container>
    )
}
