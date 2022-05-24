import React, { useState, useEffect } from "react"
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

import MuiAccordion from "@mui/material/Accordion"
import MuiAccordionSummary from "@mui/material/AccordionSummary"
import MuiAccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { styled } from "@mui/material/styles"

import Match from "components/match"

import { useQuery } from "react-query"

import { useNavigate } from "react-router-dom"
import gamesService from "services/gamesService"

import { capitalizeFirstLetter } from "utils/stringService"

import theme from "../utils/theme"
import { useSocketContext } from "context/socketContext"

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    "&:not(:last-child)": {
        borderBottom: 0,
    },
    "&:before": {
        display: "none",
    },
}))

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={
            <ExpandMoreIcon
                sx={{
                    fontSize: "0.9rem",
                    color: "white",
                }}
            />
        }
        {...props}
    />
))(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    flexDirection: "row-reverse",
    borderRadius: "10px",
    "& .MuiAccordionSummary-expandIconWrapper": {
        color: "white",
    },
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
        marginLeft: theme.spacing(1),
    },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.light,
    margin: "5px 0 0 0",
    borderRadius: "10px",
}))

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
    } = useQuery("publicGames", gamesService.getPublicGames)

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
                    height: "70px",
                }}
                startIcon={<Icon baseClassName="fas" className="fa-circle-plus" />}
            >
                Nueva Partida
            </Button>

            <Accordion>
                <AccordionSummary 
                    size="small"
                    expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            m: 2,
                            color: "white",
                        }}
                    >
                        Partidas públicas
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        item
                        justifyContent="center"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        {!publicGamesLoading &&
                            !publicGamesError &&
                            publicGames.games.map((item, key) => <Match key={key} match={item} />)}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary 
                    size="small"
                    expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            m: 2,
                            color: "white",
                        }}
                    >
                        Partidas privadas
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        item
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        margin="0"
                        gap="0.1rem"
                    >
                        {!privateGamesLoading &&
                            !privateGamesError &&
                            privateGames.games.map((item, key) => <Match key={key} match={item} />)}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary 
                    size="small"
                    expandIcon={<ExpandMoreIcon />}>
                    <Typography
                        variant="h6"
                        align="center"
                        sx={{
                            m: 2,
                            color: "white",
                        }}
                    >
                        Invitaciones
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid
                        container
                        item
                        spacing={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        margin="0"
                        gap="0.1rem"
                    >
                        {!invitesLoading &&
                            !invitesError &&
                            invites.invites.map((item) => (
                                <Grid item xs={20} md={20} key={item}>
                                    <Card>
                                        <CardActionArea
                                            onClick={() => {
                                                handleGames(item)
                                            }}
                                        >
                                            <CardMedia height="140" alt={item} />
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    component="div"
                                                >
                                                    {item.rid}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Container>
    )
}
