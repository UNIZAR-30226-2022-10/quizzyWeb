import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { useTheme } from "@mui/material"

import {
    Container,
    Card,
    CardContent,
    Box,
    List,
    ListItem,
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

import questionService from "../services/questionService"
import Loader from "components/Loader"
import userService from "services/userService"

import "index.css"

export default function Admin() {
    const theme = useTheme()

    const listStyle = {
        gap: "1rem",
    }

    const listItemStyle = {
        borderRadius: "1rem",
    }
    
    const [openDialog, setOpenDialog] = useState(false);
    const [question, setQuestion] = useState({});

    // loading flags
    const [loadingR, setLoadingR] = useState(false)
    const [loadingA, setLoadingA] = useState(false)

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleClickReview = (e, q) => {
        e.preventDefault()
        setQuestion(q)
        setOpenDialog(true)
    }

    const handleClickAccept = async (e) => {
        e.preventDefault()
        setLoadingA(true);
        // accept and close
        await questionService
            .acceptProposal(question.question_id)
            .then(() => {
                setSuccess(
                    "La pregunta ha sido aceptada con éxito."
                )
                refetchproposals();
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoadingA(false);
                setOpenDialog(false);
            });
    }

    const handleClickReject = async (e) => {
        e.preventDefault()
        setLoadingR(true);
        await questionService
            .rejectProposal(question.question_id)
            .then(() => {
                setSuccess(
                    "La pregunta ha sido rechazada con éxito."
                )
                refetchproposals();
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoadingR(false);
                setOpenDialog(false);
            });
    }

    const handleClose = (e) => {
        e.preventDefault()
        setOpenDialog(false);
    }

    const {
        isLoading: proposalsLoading,
        error: proposalsError,
        data: proposals,
        refetch: refetchproposals,
    } = useQuery("proposals", questionService.getPendingProposals)

    function QuestionCard({q}) {

        let fields = [
            { label : "Enunciado",  content : q.question },
            { label : "Categoría",  content : q.category_name },
            { label : "Dificultad", content : q.difficulty },
            { label : "Respuesta correcta", content : q.correct_answer },
            { label : "Respuesta incorrecta 1", content : q.wrong_answer_1 },
            { label : "Respuesta incorrecta 2", content : q.wrong_answer_2 },
            { label : "Respuesta incorrecta 3", content : q.wrong_answer_3 },
        ]

        return ( 
            <Card fullWidth>
                <CardContent>
                    {fields.map((f, key) => 
                        <>
                            <div 
                                key={key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem"
                                }}
                            >
                                <Typography sx={{width: "40%", fontSize: "16px"}} variant="h6">
                                    {f.label}
                                </Typography>
                                <Typography sx={{width: "60%"}} color="text.secondary">
                                    {f.content}
                                </Typography>
                            </div>
                            <Divider />
                        </>
                    )}
                </CardContent>
            </Card> 
        );
    }

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
            maxWidth="md"
        >
            <Box sx={{ margin: "1rem 0" }}>
                <Typography variant="h2">
                    Revisión de preguntas
                </Typography>
                <List sx={listStyle}>
                    {!proposalsLoading && !proposalsError && proposals.questions.map((question, key) => (
                        <div key={key}>
                            <ListItem sx={listItemStyle}>
                                <ListItemText primary={question.question} />
                                <Button
                                    onClick={(e) => handleClickReview(e, question)}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={
                                        <Icon
                                            baseClassName="fas"
                                            className="fa-magnifying-glass"
                                        />
                                    }
                                >
                                    Revisar pregunta
                                </Button>
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
            </Box>
            <Dialog
                fullWidth
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box position="absolute" top={1} right={1}>
                    <Icon
                        color="error"
                        baseClassName="fas"
                        className="fa-close"
                        onClick={handleClose}
                    />
                </Box>
                <DialogTitle id="alert-dialog-title">
                    {"Revisar pregunta"}
                </DialogTitle>
                <DialogContentText
                    sx={{
                        padding: "2em",
                    }}
                >
                    <QuestionCard q={question}/>
                    
                </DialogContentText>
                <DialogActions>
                    <Button
                        onClick={handleClickReject}
                        variant="contained"
                        color="error"
                        endIcon={<Icon baseClassName="fas" className="fa-xmark" />}
                    >
                        {loadingR ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            "Rechazar"
                        )}
                    </Button>
                    <Button
                        onClick={handleClickAccept}
                        variant="contained"
                        color="success"
                        endIcon={<Icon baseClassName="fas" className="fa-check" />}
                        autoFocus
                    >
                        {loadingA ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            "Aceptar"
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
