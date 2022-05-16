import React, { useState } from 'react'
import {
    Container,
    Tabs,
    Tab,
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
    InputLabel,
    Icon,
    Button,
    Select,
    Divider,
    Dialog,
    DialogTitle,
    DialogContentText,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress,
    MenuItem,
} from "@mui/material"

import SendIcon from "@material-ui/icons/Send";

const categories = [
    "all",
    "Geography",
    "Art",
    "History",
    "Science",
    "Sports",
    "Entertainment"
];
const difficulties = ["easy", "medium", "hard"];

function Proposal() {

    const [stmt, setStmt] = useState("");
    const [category, setCategory] = useState("all");
    const [diff, setDiff] = useState("all");
    const [cans, setCans] = useState("");
    const [wans1, setWans1] = useState("");
    const [wans2, setWans2] = useState("");
    const [wans3, setWans3] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(stmt);
        console.log(category);
        console.log(diff);
        console.log(cans);
        console.log(wans1);
        console.log(wans2);
        console.log(wans3);
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{display:'flex',flexDirection:'column'}}
        >
            <form
                style={{

                }} 
                onSubmit={handleSubmit}>
                <Typography
                    sx={{
                        margin: "2rem 0"
                    }} 
                    variant="h2">
                    Propón una pregunta
                </Typography>
                <Typography
                    sx={{
                        margin: "0.5rem 0"
                    }} 
                >
                    Enunciado de la pregunta
                </Typography>
                <TextField
                    multiline
                    rows={3}
                    autoFocus
                    fullWidth
                    sx={{
                        height: "10rem"
                    }}
                    variant="outlined"
                    value={stmt}
                    onChange={(e) => setStmt(e.target.value)}
                />
                <InputLabel 
                    sx={{
                        margin: "0.5rem 0"
                    }} 
                >
                    Enunciado de la pregunta
                </InputLabel>
                <Select
                    autoFocus
                    defaultValue="all"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map((m, key) => <MenuItem key={key} value={m}>{m}</MenuItem>)}
                </Select>
                <Select
                    autoFocus
                    defaultValue="all"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    {categories.map((m, key) => <MenuItem key={key} value={m}>{m}</MenuItem>)}
                </Select>
                <Button
                    variant="contained"
                    type="submit"
                    endIcon={
                        <SendIcon />
                    }
                >
                    Enviar
                </Button>
            </form>
        </Container>
    )
}

export default Proposal