import React, {useState, useEffect} from 'react'
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import {Tabs, Tab} from "@mui/material"
import { useTheme } from "@mui/material"

import "index.css"

export default function Stats() {
    const theme = useTheme()

    // tab value
    const [value, setValue] = useState(0)

    const handleChange = (e, v) => {
        e.preventDefault()
        setValue(v)
    }

    const [partidas] = useState([
        "Last Game",
        "Game x",
        "Game y",
        "Game z",
        "Game w",
    ]); 

    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "1rem",
            }}
        >
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <Tabs
                    value={value}
                    variant="fullWidth"
                >
                    <Tab label={"Historial"}></Tab>
                </Tabs>
            </Box>
        </Container>
    )
}
