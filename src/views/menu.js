import React, { useState, useEffect } from "react"
import {
    Container,
    Typography,
    Icon,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    Snackbar,
    Alert,
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
    const { socket, socketService } = useSocketContext()
    let navigate = useNavigate()

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

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

    const handleClickAccept = (e, rid, nick) => {
        e.preventDefault()
        gamesService
            .removeInvite(rid, nick)
            .then(() => {
                socketService.joinPrivateMatch(rid, (args) => {
                    console.log("args : ", args)
                    if (args.ok) {
                        navigate(
                            "/privada",
                            {
                                state: {
                                    rid,
                                    players: args.players.map((p) => {
                                        return { nickname: p, cosmetic: 1 }
                                    }),
                                },
                            },
                            { replace: false }
                        )
                    } else {
                        setError(
                            "Error al unirse a la partida privada : " + args.msg
                        )
                    }
                })
            })
            .catch(() => {
                setError("Error al aceptar la invitación")
            })
    }

    const handleClickReject = (e, rid, nick) => {
        e.preventDefault()
        gamesService.removeInvite(rid, nick)
        refetchInvites()
    }

    const handleResume = (args, rid, pub) => {
        console.log("aa")
        if (args.ok === true) {
            let players = Object.assign({}, ...Object.keys(args.info.stats).map((p) => (
                {
                    [p] : {
                        avatar: 1,
                        correctAnswers: [0, 0, 0, 0, 0, 0],
                        position: args.info.stats[p].position,
                        tokens: [false, false, false, false, false, false],
                        totalAnswers: [0, 0, 0, 0, 0, 0],
                    }
                }
            )))
            navigate(`/tablero/${rid}`, {
                state: {
                    players,
                    pub,
                },
            })
        } else {
            setError("Error al reanudar partida : " + args.msg)
        }
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
                <AccordionSummary size="small" expandIcon={<ExpandMoreIcon />}>
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
                        publicGames.games.length !== 0 ? (
                            publicGames.games.map((item, key) => (
                                <Match
                                    key={key}
                                    match={item}
                                    pub={true}
                                    onResume={(args) =>
                                        handleResume(
                                            args,
                                            item.rid,
                                            true,
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <Typography variant="h6" align="center" color="white">
                                No hay partidas públicas
                            </Typography>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary size="small" expandIcon={<ExpandMoreIcon />}>
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
                        privateGames.games.length !== 0 ? (
                            privateGames.games.map((item, key) => (
                                <Match
                                    key={key}
                                    match={item}
                                    pub={false}
                                    onResume={(args) =>
                                        handleResume(
                                            args,
                                            item.rid,
                                            false,
                                        )
                                    }
                                />
                            ))
                        ) : (
                            <Typography variant="h6" align="center" color="white">
                                No hay partidas privadas
                            </Typography>
                        )}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary size="small" expandIcon={<ExpandMoreIcon />}>
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
                    <List sx={{ width: "100%" }}>
                        {!invitesLoading &&
                        !invitesError &&
                        invites.invites.length !== 0 ? (
                            invites.invites.map((item, key) => (
                                <div key={key}>
                                    <ListItem>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    color="white"
                                                    variant="b"
                                                >
                                                    {item.leader_nickname}
                                                </Typography>
                                            }
                                        />
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "1em",
                                            }}
                                        >
                                            <Button
                                                onClick={(e) =>
                                                    handleClickAccept(
                                                        e,
                                                        item.rid,
                                                        item.leader_nickname
                                                    )
                                                }
                                                variant="contained"
                                                color="success"
                                                endIcon={
                                                    <Icon
                                                        baseClassName="fas"
                                                        className="fa-check"
                                                    />
                                                }
                                            >
                                                Añadir
                                            </Button>
                                            <Button
                                                onClick={(e) =>
                                                    handleClickReject(
                                                        e,
                                                        item.rid,
                                                        item.leader_nickname
                                                    )
                                                }
                                                variant="contained"
                                                color="error"
                                                endIcon={
                                                    <Icon
                                                        baseClassName="fas"
                                                        className="fa-xmark"
                                                    />
                                                }
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </ListItem>
                                </div>
                            ))
                        ) : (
                            <Typography variant="h6" align="center" color="white">
                                No hay invitaciones
                            </Typography>
                        )}
                    </List>
                </AccordionDetails>
            </Accordion>
            {/* Success snackbar */}
            <Snackbar
                open={success !== null}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
            >
                <Alert
                    onClose={() => setSuccess(null)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {success}
                </Alert>
            </Snackbar>
            {/* Error snackbar */}
            <Snackbar
                open={error !== null}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert
                    onClose={() => setError(null)}
                    severity="error"
                    sx={{ width: "100%" }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}
