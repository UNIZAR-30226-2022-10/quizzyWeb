import React, {useState, useEffect} from 'react'
import {Container,
        Box,
        Tab,
        Tabs,
        Accordion,
        AccordionDetails
} from "@mui/material"
import { useTheme } from "@mui/material"

import PublicMatch from "../components/games/publicMatch"
import PrivateMatch from "../components/games/privateMatch"

import "index.css"

const players = [
    { nickname : "hola", actual_cosmetic : 3 },
    { nickname : "hola2", actual_cosmetic : 1 },
    { nickname : "hola3", actual_cosmetic : 2 },
    { nickname : "hola4", actual_cosmetic : 5 },
    { nickname : "hola5", actual_cosmetic : 1 },
    { nickname : "hola6", actual_cosmetic : 7 },
]

export default function Stats() {

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

    const theme = useTheme()

    // tab value
    const [value, setValue] = useState(0)

    const handleChange = (e, v) => {
        e.preventDefault()
        setValue(v)
    }

    const [matches] = useState([
        players, players, players
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
                    onChange={handleChange}
                    variant="fullWidth"
                >
                    <Tab label={"Historial Partidas Públicas"}/>
                    <Tab label={"Historial Partidas Privadas"}/>
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}>
                {matches.map((item, idx) =>
                    <PublicMatch key={idx} rid={idx} players={item} winner={item[0].nickname} />
                )}
            </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <div
                style={{
                    marginTop:"20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem"
                }}>
                {matches.map((item, idx) =>
                    <PrivateMatch key={idx} rid={idx} time={15} difficulty={"hard"} help={false} players={item} winner={item[0].nickname} />
                )}
            </div>
            </TabPanel>
        </Container>
    )
}
