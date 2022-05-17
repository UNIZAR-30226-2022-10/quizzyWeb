import { styled, ThemeProvider } from "@mui/material/styles"
import Container from "@mui/material/Container"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"

import Button from "@mui/material/Button"
import Icon from "@mui/material/Icon"
import { useNavigate } from "react-router-dom"

import theme from '../utils/theme';

export default function Menu() {
    let navigate = useNavigate()
    function handleSolo(e) {
        navigate("/solo", { replace: false })
    }

    function handleMultiPublico(e) {
        navigate("/multi", { replace: false })
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "1em",
                minHeight: "100%"
            }}
        >
            {/* SOLO */}
            <Paper
                elevation={5}
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
                elevation={5}
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
                    onClick={handleMultiPublico}
                    color="secondary"
                    size="large"
                    sx={{
                        width: "100%",
                        alignSelf: "center",
                        borderRadius: "10px",
                    }}
                    startIcon={<Icon baseClassName="fas" className="fa-globe" />}
                >
                    Unirse a partida pública
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
            </Paper>
        </Container>
    )
}
