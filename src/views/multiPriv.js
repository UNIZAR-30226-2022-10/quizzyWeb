/*
 * Author: - Diana
 * Filename: - multiPriv.js
 * Module: - Game / Multi / Priv
 * Description: - Start menu to begin a multi party
 */
import React, { useEffect, useRef, useState } from "react"

import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Paper,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    DialogTitle,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material"

import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from "@mui/icons-material/Send";

import Chat from "../components/chat/chat"
import "css/solo.css"

import { useLocation, useNavigate } from "react-router-dom"
import friendService from "services/friendService"
import gamesService from "services/gamesService"
import userService from "services/userService"
import { useSocketContext } from "context/socketContext";

function cosmeticssrcSet(id) {
    return {
        src: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + id + ".jpg",
        srcSet: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + id + ".jpg",
    }
}

function MultiPriv() {
    const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"]

    const { socketService } = useSocketContext();
    let navigate = useNavigate()

    const location = useLocation()

    const [friends, setFriends] = useState([])
    const [friendsLoading, setFriendsLoading] = useState(false)
    
    const [openInviteDialog, setOpenInviteDialog] = useState(false)

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const [players, setPlayers] = useState([])
    const playersRef = React.useRef(players);
    playersRef.current = players;
    const gameStartedRef = useRef();

    const handleStart = (e) => {
        e.preventDefault()
        socketService.startGame(location.state.rid, ({ok, msg}) => {
            if ( !ok ) setError("Error al comenzar la partida : " + msg);
        })
    }

    const handleClickInvite = async (e) => {
        e.preventDefault()
        setOpenInviteDialog(true)
        setFriendsLoading(true)
        await friendService
            .getFriends()
            .then((friends) => setFriends(friends))
            .catch(() => setError("Error al recuperar la lista de amigos"))
            .finally(() => setFriendsLoading(false))
    }

    const handleCloseInvite = (e) => {
        e.preventDefault()
        setOpenInviteDialog(false)
    }

    const handleClickSendInvite = async (e, nick) => {
        e.preventDefault()
        await gamesService
            .sendInvite(location.state.rid, nick)
            .then(() => setSuccess("Invitación enviada con éxito"))
            .catch((e) => {
                switch (e.response.status) {
                    case 409:
                        setError("La invitación ya ha sido enviada")
                        break
                    default:
                        setError("Error al enviar la invitación")
                }
            })
    }

    useEffect( async () => {
        gameStartedRef.current = false;

        // Get the information of players already in the room
        // TODO: FIX ISSUE : Cosmetic are set in state but not rendered correclty for the last player in room until another player joins and update the state
        const playersData = location.state.players
        await playersData.map( async (player,index) => {
            await userService.searchUsers(player.nickname)
                .then((res) => {
                    const cosmetic = res.data.results[0].actual_cosmetic
                    playersData[index] = {
                        ...playersData[index],
                        cosmetic: cosmetic
                    }
                }
            )
        })
        setPlayers(playersData)

        socketService.listenNewPlayers(async ({player}) => {
            var cosmetic = null;
            await userService.searchUsers(player)
                .then((res) => {
                    cosmetic = res.data.results[0].actual_cosmetic
                }
            )
            setPlayers((prev) => [ ...prev, {nickname : player, cosmetic : cosmetic} ]);
        });

        socketService.listenLeavePlayers(({player}) => {
            setPlayers((prev) => prev.filter((u) => u.nickname !== player));
        });

        // Begin
        socketService.turn((args) => {
            console.log("server:turn args :", args);
            gameStartedRef.current = true;
            const jugadores = args.stats
            Object.keys(jugadores).map((keyName) => {
                playersRef.current.forEach((player) => {
                    if (player.nickname === keyName) 
                        jugadores[keyName].cosmetic = player.cosmetic
                })
            })
            navigate(`/tablero/${location.state.rid}`, { state: { players : jugadores, timer : args.timer/1000, pub : false } });
        })

        return () => {
            if ( gameStartedRef.current === false ) {
                socketService.leaveRoom(location.state.rid, () => { console.log("left room") });
            }
            socketService.cleanup('server:turn');
            socketService.cleanup('server:private:player:join');
            socketService.cleanup('server:private:player:leave');
        }
    }, [])

    return (
        <Container
            maxWidth="md"
            component="main"
            sx={{
                marginBottom: "2rem",
            }}
        >
            <Box my={4}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Sala {location.state.rid}
                </Typography>
            </Box>

            <div
                style={{
                    display: "flex",
                }}
            >
                {/* Chat*/}
                <div
                    style={{
                        flex: 1,
                    }}
                >
                    <Chat rid={location.state.rid} />
                </div>
                {/* Players*/}
                <Paper
                    elevation={5}
                    sx={{
                        display: "flex",
                        flex: 1,
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
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "8px",
                            fontWeight: "bold",
                        }}
                    >
                        Jugadores:
                    </Typography>
                    {/* Players */}
                    <Grid
                        container
                        item
                        justifyContent="center"

                    >
                        {playersRef.current.map((item, key) => (
                            <Grid item xs={20} md={24} key={key}>
                                <Card>
                                    <CardContent sx={{display:'flex', wrap: 'nowrap'}}>
                                        <Avatar
                                            src={cosmeticssrcSet(item.cosmetic).src}
                                            sx={{mr:1, border: `3px solid ${colors[key]}`}}
                                        />
                                        <Typography variant="h6" gutterBottom component="div">
                                            {item.nickname}
                                        </Typography> 
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </div>
            <div
                style={{
                    align: "center",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                {/* Invite button*/}
                <Button
                    variant="contained"
                    display="inline-block"
                    size="large"
                    fullWidth
                    onClick={handleClickInvite}
                    style={{
                        align: "center",
                        display: "flex",
                        justifyContent: "center",
                        minWidth: "47%",
                        marginRigth: "25px",
                    }}
                    endIcon={
                        <PersonAddIcon />
                    }
                >
                    Invitar amigos
                </Button>

                {/* Start button*/}
                <Button
                    variant="contained"
                    display="inline-block"
                    size="large"
                    onClick={handleStart}
                    style={{
                        align: "center",
                        display: "flex",
                        justifyContent: "center",
                        marginRight: "10px",
                        marginLeft: "25px",
                        minWidth: "47%",
                    }}
                    endIcon={
                        <PlayCircleIcon />
                    }
                >
                    Comenzar partida
                </Button>
            </div>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={openInviteDialog}
                onClose={handleCloseInvite}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Invitar amigos"}</DialogTitle>
                <DialogActions sx={{ width: "100%" }}>
                    <List sx={{ width: "100%" }}>
                        {friendsLoading ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            friends.friends?.map((friend, key) => (
                                <div key={key}>
                                    <ListItem
                                        sx={{
                                            width: "100%",
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={
                                                    cosmeticssrcSet(
                                                        friend.actual_cosmetic
                                                    ).src
                                                }
                                            />
                                        </ListItemAvatar>
                                        <ListItemText primary={friend.nickname} />
                                        <Button
                                            onClick={(e) =>
                                                handleClickSendInvite(
                                                    e,
                                                    friend.nickname
                                                )
                                            }
                                            variant="contained"
                                            color="primary"
                                            endIcon={<SendIcon />}
                                        >
                                            Invitar
                                        </Button>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))
                        )}
                    </List>
                </DialogActions>
            </Dialog>
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

export default MultiPriv
