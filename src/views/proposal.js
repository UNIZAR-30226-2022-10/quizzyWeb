import React, { useState } from "react"
import {
    Container,
    TextField,
    Typography,
    InputLabel,
    Button,
    Select,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material"

import SendIcon from "@material-ui/icons/Send"
import questionService from "services/questionService"

const categories = [
    "Geography",
    "Art",
    "History",
    "Science",
    "Sports",
    "Entertainment",
]
const difficulties = ["easy", "medium", "hard"]

function Proposal() {
    const [loading, setLoading] = useState(false);
    const [stmt, setStmt] = useState("");
    const [category, setCategory] = useState(categories[0]);
    const [diff, setDiff] = useState(difficulties[0]);
    const [cans, setCans] = useState("");
    const [wans1, setWans1] = useState("");
    const [wans2, setWans2] = useState("");
    const [wans3, setWans3] = useState("");

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        await questionService.sendProposal(stmt, category, diff, cans, wans1, wans2, wans3)
            .then(() => {
                setSuccess("¡Propuesta de pregunta enviada!")
            })
            .catch((e) => {
                setError("No se pudo enviar la solicitud.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const answerFields = [
        { title: "Respuesta correcta", value: cans,  stateset: setCans },
        { title: "Respuesta incorrecta 1", value: wans1, stateset: setWans1 },
        { title: "Respuesta incorrecta 2", value: wans2, stateset: setWans2 },
        { title: "Respuesta incorrecta 3", value: wans3, stateset: setWans3 }
    ]

    return (
        <Container maxWidth="md" sx={{ display: "flex", flexDirection: "column" }}>
            <form style={{}} onSubmit={handleSubmit}>
                <Typography
                    sx={{
                        margin: "2rem 0",
                    }}
                    variant="h2"
                >
                    Propón una pregunta
                </Typography>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <InputLabel>Enunciado de la pregunta</InputLabel>
                        <TextField
                            multiline
                            autoFocus
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={stmt}
                            onChange={(e) => setStmt(e.target.value)}
                        />
                    </div>
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                                width: "50%",
                            }}
                        >
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                sx={{
                                    width: "100%",
                                }}
                                autoFocus
                                size="small"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((m, key) => (
                                    <MenuItem key={key} value={m}>
                                        {m}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "50%",
                                gap: "1rem"
                            }}
                        >
                            <InputLabel>Dificultad</InputLabel>
                            <Select
                                sx={{
                                    width: "100%",
                                }}
                                autoFocus
                                size="small"
                                value={diff}
                                onChange={(e) => setDiff(e.target.value)}
                            >
                                {difficulties.map((m, key) => (
                                    <MenuItem key={key} value={m}>
                                        {m}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "1rem"
                        }}
                    >
                        {answerFields.map((obj, key) => 
                            <div
                                key={key}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1rem",
                                }}
                            >
                                <InputLabel>{obj.title}</InputLabel>
                                <TextField
                                    multiline
                                    autoFocus
                                    fullWidth
                                    rows={2}
                                    variant="outlined"
                                    value={obj.value}
                                    onChange={(e) => obj.stateset(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: "2rem 0",
                    }}
                >
                    <Button
                        variant="contained" 
                        type="submit" 
                        endIcon={<SendIcon />}>
                        {loading ? (
                            <CircularProgress size={25} color="light" />
                        ) : (
                            "Enviar"
                        )}
                    </Button>
                </div>
            </form>
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

export default Proposal
