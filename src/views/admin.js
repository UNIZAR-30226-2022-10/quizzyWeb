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

export default function Admin() {
    const theme = useTheme()

    const listStyle = {
        gap: "1rem",
    }

    const listItemStyle = {
        borderRadius: "1rem",
    }
    
    // tab value
    const [value, setValue] = useState(0)

    // loading flag
    const [loading, setLoading] = useState(false)

    // success and error snackbar message
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

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

    const handleChange = (e, v) => {
        e.preventDefault()
        setValue(v)
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
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>

            </TabPanel>
            <TabPanel value={value} index={1}>

            </TabPanel>
        </Container>
    )
}
