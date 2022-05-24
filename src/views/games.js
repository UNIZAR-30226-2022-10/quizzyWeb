import React, { useState, useEffect } from 'react'
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
} from "@mui/material"
import { useNavigate } from "react-router-dom"

import theme from '../utils/theme';
import { useSocketContext } from 'context/socketContext';

function Games() {
    const [gameCode, setGameCode] = useState(0);

    function handleTextBox(e) {
        e.preventDefault();
        setGameCode(parseInt(e.target.value));
    }

    function handleSubmit(e) {
        e.preventDefault();
        alert(gameCode);
    }

    const { socketService } = useSocketContext();
    let navigate = useNavigate()
    function handleSolo(e) {
        navigate("/solo", { replace: false })
    }

    const joinCallback = ({ok, msg}) => {
        if ( ok ) {  
            setWaiting(true);
            setSuccess("Esperando más jugadores...");
        } else {
            setError("Error al entrar en una sala pública:", msg);
        }
    }

    function handleCrearPrivada(e) {
        let rid = 0;
        navigate("/privada", {state : { rid }}, {replace: false})
    }

    const joinedCallback = ({ rid, users }) => {
        setWaiting(false);
        if ( rid != null ) {
            setWaiting(false);
            console.log("joined", rid);
            navigate(`/multi/${rid}`, { replace: false });
        } else {
            setError("Error al entrar en una sala pública:");
        }
    }

    function handleMultiPublic(e) {
        socketService.joinPublicMatch(
            joinCallback,
            joinedCallback
        )
    }

    function handleLeave(e) {
        e.preventDefault();
        socketService.leavePublicMatch(({ok, msg}) => { setWaiting(false); });
        setSuccess("Búsqueda de partida cancelada con éxito")
    }
    useEffect(() => {
        return () => {
            if (waiting) socketService.leavePublicMatch(({ok, msg}) => { setWaiting(false); });
        }
    }, [])
    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [waiting, setWaiting ] = useState(false);
    
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection:"column",
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
                        padding: "1rem 0",
                        display: "flex",
                    }}
                    //className="chat-input"
                    onSubmit={handleSubmit}
                >
                    <TextField
                        autoFocus
                        placeholder="Introduce un código de búsqueda"
                        variant="outlined"
                        size="small"
                        color="secondary"
                        type="number"
                        value={gameCode}
                        fullWidth
                        sx = {{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: "white",
                                borderRadius: "10px 0 0 10px",
                              },
                              
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
                        }}
                        startIcon={
                            <Icon baseClassName="fas" className="fa-search" />
                        }
                    >
                        Submit
                    </Button>
                </form>
                <Button
                    variant="contained"
                    onClick={handleCrearPrivada}
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
                {waiting && <Button
                    variant="contained"
                    onClick={handleLeave}
                    color="error"
                    size="large"
                    sx={{
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={
                        <Icon baseClassName="fas" className="fa-xmark" />
                    }
                >
                    Cancelar
                </Button>}
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
        </Container>
    )
}

export default Games