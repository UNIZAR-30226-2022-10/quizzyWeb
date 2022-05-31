import React, { useState, useEffect } from "react"
import {
    Container,
    Paper,
    Typography,
    Icon,
    Button,
    Alert,
    Snackbar,
    TextField,
    CircularProgress,
    Dialog,
    DialogContent,
    Grid,
    Card,
    CardActionArea,
    ToggleButton,
    ToggleButtonGroup,
    CardMedia,
    CardContent,
    Switch,
} from "@mui/material"
import { useNavigate } from "react-router-dom"

import { styled } from "@mui/material/styles"

import { capitalizeFirstLetter } from "utils/stringService"
import theme from "../utils/theme"
import { useSocketContext } from "context/socketContext"

import userService from "services/userService"

import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import CloseIcon from '@mui/icons-material/Close';

const DifficultyToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
        margin: theme.spacing(0.5),
        border: 0,
        "&:not(:first-of-type)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-of-type": {
            borderRadius: theme.shape.borderRadius,
        },
        "&.Mui-disabled": {
            border: 0,
        },
        "&.Mui-selected": {
            fontWeight: "bold",
            "&:not(:first-of-type)": {
                backgroundColor: "#ffffba",
            },
            "&:last-of-type": {
                backgroundColor: "#ffb3ba",
            },
            "&:first-of-type": {
                backgroundColor: "#baffc9",
            },
            color: "black",
        },
    },
}))
const TimerToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    "& .MuiToggleButtonGroup-grouped": {
        margin: theme.spacing(0.5),
        border: 0,
        "&:not(:first-of-type)": {
            borderRadius: theme.shape.borderRadius,
        },
        "&:first-of-type": {
            borderRadius: theme.shape.borderRadius,
        },
        "&.Mui-disabled": {
            border: 0,
        },
        "&.Mui-selected": {
            fontWeight: "bold",
            backgroundColor: "#bae1ff",
            color: "black",
        },
    },
}))

function Games() {
    const { socketService } = useSocketContext()

    let navigate = useNavigate()

    const [gameCode, setGameCode] = useState(0)
    const [wildcardsEnable, setWildcardsEnable] = useState(true)
    const [difficulty, setDifficulty] = React.useState("medium")
    const [categories, setCategories] = React.useState({
        History: true,
        Science: true,
        Geography: true,
        Sports: true,
        Entertainment: true,
        Art: true,
    })
    const [timer, setTimer] = React.useState("15")
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)

    const handleDifficulty = (event, data) => {
        if (data !== null) {
            setDifficulty(data)
        }
    }

    const handleTimer = (event, data) => {
        if (data !== null) {
            setTimer(data)
        }
    }

    const handleCategory = (data) => {
        // if data in categories is true, set to false
        // else set to true
        setCategories({
            ...categories,
            [data]: !categories[data],
        })
    }

    const handleWildcardSwitch = (e) => {
        setWildcardsEnable(e.target.checked)
    }

    const handleTextBox = (e) => {
        e.preventDefault()
        setGameCode(parseInt(e.target.value))
    }

    const handleSubmitCode = (e) => {
        e.preventDefault()
        socketService.joinPrivateMatch(gameCode, (args) => {
            console.log(args)
            if (args.ok) {
                navigate(
                    "/privada",
                    {
                        state: {
                            rid: gameCode,
                            players: args.players.map((p) => {
                                return { nickname: p, cosmetic: 1 }
                            }),
                        },
                    },
                    { replace: false }
                )
            } else {
                setError("Error al unirse a la partida privada : " + args.msg)
            }
        })
    }

    const handleCreatePrivate = (e) => {
        setOpenDialog(true)
    }

    const handleCreateButton = (e) => {
        console.log(gameCode, difficulty, categories, timer)
        setLoading(true)
        socketService.createPrivateMatch(
            {
                turnTimeout: parseInt(timer) * 1000,
                difficulty,
                categories,
                wildcardsEnable,
            },
            (args) => {
                console.log(args)
                if (args.ok) {
                    userService.getUser()
                        .then((user) => {
                            navigate(
                                "/privada",
                                {
                                    state: {
                                        rid: args.rid,
                                        players: [
                                            {
                                                nickname: user.data.nickname,
                                                cosmetic: user.data.actual_cosmetic,
                                            },
                                        ],
                                    },
                                },
                                { replace: false }
                            )
                        })
                        .catch((e) => {
                            setError("Error al obtener información del usuario")
                        })
                } else {
                    setError("Error al crear la partida privada")
                }
            }
        )
    }

    const handleSolo = (e) => {
        navigate("/solo", { replace: false })
    }

    const joinCallback = ({ ok, msg }) => {
        if (ok) {
            setWaiting(true)
            setSuccess("Esperando más jugadores...")
        } else {
            setError("Error al entrar en una sala pública:", msg)
        }
    }

    const joinedCallback = ({ rid, users }) => {
        setWaiting(false)
        if (rid != null) {
            setWaiting(false)
            console.log("joined", rid)
            navigate(`/multi/${rid}`, { replace: false })
        } else {
            setError("Error al entrar en una sala pública:")
        }
    }

    const handleMultiPublic = (e) => {
        socketService.joinPublicMatch(joinCallback, joinedCallback)
    }

    const handleLeave = (e) => {
        e.preventDefault()
        socketService.leavePublicMatch(({ ok, msg }) => {
            setWaiting(false)
        })
        setSuccess("Búsqueda de partida cancelada con éxito")
    }
    useEffect(() => {
        return () => {
            if (waiting)
                socketService.leavePublicMatch(({ ok, msg }) => {
                    setWaiting(false)
                })
        }
    }, [])
    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    // waiting for public game to start
    const [waiting, setWaiting] = useState(false)

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
            {/* SOLO */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
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
                    Solitario
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleSolo}
                    color="secondary"
                    size="large"
                    sx={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={
                        <Icon baseClassName="fas" className="fa-circle-plus" />
                    }
                >
                    Nueva Partida
                </Button>
            </Paper>

            {/* MULTI */}
            <Paper
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
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
                    Multi
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleMultiPublic}
                    color="secondary"
                    size="large"
                    disabled={waiting}
                    sx={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={<Icon baseClassName="fas" className="fa-globe" />}
                >
                    {waiting ? (
                        <CircularProgress size={25} color="light" />
                    ) : (
                        "Unirse a partida pública"
                    )}
                </Button>
                <form
                    style={{
                        padding: "0.5rem 0",
                        display: "flex",
                    }}
                    onSubmit={handleSubmitCode}
                >
                    <TextField
                        autoFocus
                        placeholder="Introduce un código de búsqueda"
                        variant="outlined"
                        size="small"
                        color="secondary"
                        type="number"
                        value={gameCode}
                        flex={1}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "white",
                                borderRadius: "10px 0 0 10px",
                                height: "100%",
                            },
                            width: "50%",
                        }}
                        onChange={handleTextBox}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        sx={{
                            paddingRight: "2rem",
                            paddingLeft: "2rem",
                            alignSelf: "center",
                            borderRadius: "0 10px 10px 0",
                            width: "50%",
                            height: "100%",
                        }}
                        startIcon={
                            <Icon baseClassName="fas" className="fa-search" />
                        }
                    >
                        Unirse con código
                    </Button>
                </form>
                <Button
                    variant="contained"
                    onClick={handleCreatePrivate}
                    color="secondary"
                    size="large"
                    sx={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={<Icon baseClassName="fas" className="fa-lock" />}
                >
                    Crear partida privada
                </Button>
                {waiting && (
                    <Button
                        variant="contained"
                        onClick={handleLeave}
                        color="error"
                        size="large"
                        sx={{
                            alignSelf: "center",
                            borderRadius: "10px",
                        }}
                        startIcon={<Icon baseClassName="fas" className="fa-xmark" />}
                    >
                        Cancelar
                    </Button>
                )}
            </Paper>
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
            <Dialog open={openDialog} maxWidth="md">
                <DialogContent>
                    <Grid container rowSpacing={1}>
                        {/* Categories*/}
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
                            Categories:
                        </Typography>
                        <Grid container item justifyContent="center" spacing={1}>
                            {Object.keys(categories).map((item) => (
                                <Grid item xs={4} md={2} key={item}>
                                    <Card
                                        sx={{
                                            opacity: categories[item] ? "1" : "0.4",
                                            backgroundColor: categories[item]
                                                ? "#fff"
                                                : "#C0C1B7",
                                        }}
                                    >
                                        <CardActionArea
                                            onClick={() => {
                                                handleCategory(item)
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image={
                                                    process.env.PUBLIC_URL +
                                                    "/images/category/" +
                                                    item.toLowerCase() +
                                                    ".png"
                                                }
                                                alt={item}
                                            />
                                            <CardContent
                                                sx={{ textAlign: "center" }}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    component="div"
                                                >
                                                    {capitalizeFirstLetter(item)}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        {/* Difficulty & Timer*/}
                        <Grid container item justifyContent="space-between">
                            {/* Difficulty*/}
                            <Grid container item xs={12} md={6}>
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
                                    Difficulty :
                                </Typography>
                                <DifficultyToggleButtonGroup
                                    color="primary"
                                    value={difficulty}
                                    exclusive
                                    onChange={handleDifficulty}
                                    aria-label="choose difficulty"
                                >
                                    <ToggleButton value="easy" aria-label="easy">
                                        <Icon
                                            baseClassName="fas"
                                            className="fa-baby"
                                        />{" "}
                                        Easy
                                    </ToggleButton>
                                    <ToggleButton value="medium" aria-label="medium">
                                        <Icon
                                            baseClassName="fas"
                                            className="fa-user"
                                        />{" "}
                                        Medium
                                    </ToggleButton>
                                    <ToggleButton value="hard" aria-label="hard">
                                        <Icon
                                            baseClassName="fas"
                                            className="fa-skull"
                                        />{" "}
                                        Hard
                                    </ToggleButton>
                                </DifficultyToggleButtonGroup>
                            </Grid>
                            {/* Timer*/}
                            <Grid container item xs={12} md={6}>
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
                                    Response time :
                                </Typography>
                                <TimerToggleButtonGroup
                                    color="primary"
                                    value={timer}
                                    exclusive
                                    onChange={handleTimer}
                                    aria-label="choose maximum response time "
                                >
                                    <ToggleButton value="10" aria-label="10">
                                        10s
                                    </ToggleButton>
                                    <ToggleButton value="15" aria-label="15">
                                        15s
                                    </ToggleButton>
                                    <ToggleButton value="20" aria-label="20">
                                        20s
                                    </ToggleButton>
                                    <ToggleButton value="30" aria-label="30">
                                        30s
                                    </ToggleButton>
                                </TimerToggleButtonGroup>
                            </Grid>
                            <Grid container item xs={12} md={6}>
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
                                    Allow wildcards?
                                </Typography>
                                <Switch
                                    checked={wildcardsEnable}
                                    onChange={handleWildcardSwitch}
                                    inputProps={{ "aria-label": "controlled" }}
                                />
                            </Grid>
                        </Grid>
                        {/* buttons */}
                        <Grid container item justifyContent="space-between">
                            <Button
                                variant="contained"
                                size="large"
                                color="error"
                                onClick={() => setOpenDialog(false)}
                                endIcon={<CloseIcon />}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleCreateButton}
                                endIcon={<PlayCircleFilledWhiteIcon />}
                            >
                                {loading ? (
                                    <CircularProgress size={25} color="light" />
                                ) : (
                                    "Crear partida privada"
                                )}
                            </Button>
                            
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default Games
