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

import theme from '../utils/theme';
import { useSocketContext } from 'context/socketContext';

function Games() {

    const { socket, socketService } = useSocketContext();
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
        navigate("/privada", {replace: false})
    }

    const joinedCallback = ({ rid }) => {
        console.log("done")
        setWaiting(false);
        if ( rid ) {
            setWaiting(false);
            console.log("joined", rid);
            navigate("/multi", { replace: false });
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
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={<Icon baseClassName="fas" className="fa-lock" />}
                >
                    Unirse a partida privada
                </Button>
                <Button
                    variant="contained"
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