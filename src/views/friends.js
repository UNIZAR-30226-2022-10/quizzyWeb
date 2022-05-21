import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { useTheme } from "@mui/material"

import {
    Container,
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

import friendService from "../services/friendService"
import Loader from "components/Loader"
import userService from "services/userService"

import "index.css"

function cosmeticssrcSet(id) {
    return {
        src: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + id + ".jpg",

        srcSet: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + id + ".jpg",
    }
}

export default function Friends() {
    const theme = useTheme()

    const listStyle = {
        gap: "1rem",
    }

    const listItemStyle = {
        borderRadius: "1rem",
    }

    // dialog window opened state
    const [openAD, setOpenAD] = useState(false)
    const [openDD, setOpenDD] = useState(false)

    // search field value after submitting query
    const [nickSearch, setNickSearch] = useState("")

    // tab value
    const [value, setValue] = useState(0)

    // search query result
    const [search, setSearch] = useState([])

    // The user to add as a friend
    const [nickAdd, setNickAdd] = useState("")

    // The user to delete from the friend list
    const [nickDelete, setNickDelete] = useState("")

    // loading flag
    const [loading, setLoading] = useState(false)

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const {
        isLoading: friendsLoading,
        error: friendsError,
        data: friends,
        refetch: refetchFriends,
    } = useQuery("friends", friendService.getFriends)

    const {
        isLoading: pendingLoading,
        error: pendingError,
        data: pending,
        refetch: refetchPending,
    } = useQuery("pending", friendService.getPending)

    const handleChange = (e, v) => {
        e.preventDefault()
        setValue(v)
    }

    const handleNickChange = (e) => {
        e.preventDefault()
        setNickSearch(e.target.value)
    }

    const handleClickAdd = (e, nick) => {
        e.preventDefault()
        setNickAdd(nick)
        setOpenAD(true)
    }

    const handleClickDelete = (e, nick) => {
        e.preventDefault()
        setNickDelete(nick)
        setOpenDD(true)
    }

    const handleCloseAdd = (e) => {
        e.preventDefault()
        setOpenAD(false)
    }

    const handleCloseDelete = (e) => {
        e.preventDefault()
        setOpenDD(false)
    }

    const handleSendAdd = async (e) => {
        e.preventDefault()
        setLoading(true)
        await friendService
            .addFriend(nickAdd)
            .then(() => {
                setSuccess("¡Solicitud de amistad enviada!")
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoading(false)
            })
        setOpenAD(false)
    }

    const handleSendDelete = async (e) => {
        e.preventDefault()
        setLoading(true)
        await friendService
            .deleteFriend(nickDelete)
            .then(() => {
                setSuccess(
                    "Se ha borrado a " + nickDelete + " de tu lista de amigos."
                )
                refetchFriends()
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoading(false)
            })
        setOpenDD(false)
    }

    const handleClickAccept = async (e, nick) => {
        await friendService
            .acceptFriend(nick)
            .then(() => {
                setSuccess("Se ha añadido a " + nick + " a tu lista de amigos.")
                refetchPending()
                refetchFriends()
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleClickReject = async (e, nick) => {
        await friendService
            .deleteFriend(nick)
            .then(() => {
                setSuccess("Se ha rechazado la solicitud de amistad de " + nick)
                refetchPending()
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const submitSearch = async (e) => {
        e.preventDefault()
        await userService.searchUsers(nickSearch).then((s) => {
            let current = JSON.parse(localStorage.getItem("user"))?.nickname
            let res = s.data.results.filter((s) => s.nickname !== current)
            setSearch(res)
        })
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ p: 3 }}> {children} </Box>}
            </div>
        )
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="friend tabs"
                    variant="fullWidth"
                >
                    <Tab label={"Buscar amigos"} />
                    <Tab label={"Amigos"} />
                    <Tab
                        label={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    alignItems: "center",
                                    gap: "1rem",
                                }}
                            >
                                <p>Solicitudes</p>
                                {!pendingLoading && pending.friends?.length > 0 && (
                                    <div className="ring-container">
                                        <div className="ringring"></div>
                                        <div className="circle"></div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <form
                    style={{
                        padding: "1rem 0",
                    }}
                    className="chat-input"
                    onSubmit={submitSearch}
                >
                    <TextField
                        autoFocus
                        placeholder="Introduce una palabra de búsqueda"
                        variant="outlined"
                        value={nickSearch}
                        fullWidth
                        onChange={handleNickChange}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        startIcon={
                            <Icon baseClassName="fas" className="fa-search" />
                        }
                    >
                        Submit
                    </Button>
                </form>
                <List sx={listStyle}>
                    {search.map((user, key) => (
                        <div key={key}>
                            <ListItem sx={listItemStyle}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={
                                            cosmeticssrcSet(user.actual_cosmetic).src
                                        }
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={user.nickname} />
                                <Button
                                    onClick={(e) => handleClickAdd(e, user.nickname)}
                                    variant="contained"
                                    disabled={
                                        !friendsLoading && friends.friends.some((f) => f.nickname === user.nickname)
                                    }
                                    color="secondary"
                                    startIcon={
                                        <Icon
                                            baseClassName="fas"
                                            className="fa-circle-plus"
                                        />
                                    }
                                >
                                    {(!friendsLoading && friends.friends.some((f) => f.nickname === user.nickname)) ? (
                                        <p>Añadir amigo</p>
                                    ) : (
                                        <p>Añadir amigo</p>
                                    )}
                                </Button>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                {friendsLoading ? (
                    <Loader />
                ) : (
                    <List sx={listStyle}>
                        {!friendsLoading &&
                            friends.friends?.map((friend, key) => (
                                <div key={key}>
                                    <ListItem sx={listItemStyle}>
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
                                                handleClickDelete(e, friend.nickname)
                                            }
                                            variant="contained"
                                            color="error"
                                            startIcon={
                                                <Icon
                                                    baseClassName="fas"
                                                    className="fa-trash"
                                                />
                                            }
                                        >
                                            Eliminar
                                        </Button>
                                    </ListItem>
                                    <Divider />
                                </div>
                            ))}
                    </List>
                )}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {pendingLoading ? (
                    <Loader />
                ) : (
                    <List sx={listStyle}>
                        {!pendingLoading &&
                            pending.friends?.map((friend, key) => (
                                <div key={key}>
                                    <ListItem sx={listItemStyle}>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography variant="b">
                                                    {friend.nickname_2}
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
                                                        friend.nickname_2
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
                                                        friend.nickname_2
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
                                    <Divider />
                                </div>
                            ))}
                    </List>
                )}
            </TabPanel>
            <Dialog
                open={openAD}
                onClose={handleCloseAdd}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Enviar solicitud de amistad?"}
                </DialogTitle>
                <DialogActions>
                    <Button
                        onClick={handleCloseAdd}
                        variant="contained"
                        color="error"
                        endIcon={<Icon baseClassName="fas" className="fa-xmark" />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSendAdd}
                        variant="contained"
                        color="success"
                        endIcon={<Icon baseClassName="fas" className="fa-check" />}
                        autoFocus
                    >
                        {loading ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            "Enviar"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openDD}
                onClose={handleCloseDelete}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿Eliminar amigo?"}
                </DialogTitle>
                <DialogContentText
                    sx={{
                        padding: "2em",
                    }}
                >
                    Dejarás de ser amigo de {nickDelete}, pero podrás volver a
                    pedirle una solicitud.
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={handleCloseDelete}
                        variant="contained"
                        color="error"
                        endIcon={<Icon baseClassName="fas" className="fa-xmark" />}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSendDelete}
                        variant="contained"
                        color="success"
                        endIcon={<Icon baseClassName="fas" className="fa-check" />}
                        autoFocus
                    >
                        {loading ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            "Enviar"
                        )}
                    </Button>
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
