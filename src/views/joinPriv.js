import React from 'react'
import { Container } from '@mui/material'
import { Box } from '@mui/system'
import { Tabs, Tab } from '@mui/material'
import { TextField } from '@mui/material'
import { Button } from '@mui/material'
import { Icon } from '@mui/material'
import { useState, useEffect } from "react"
import { useQuery } from 'react-query'

import "index.css"

function JoinPriv() {

    const submitSearch = async (e) => {
        e.preventDefault()
      /*  await userService.searchUsers(nickSearch).then((s) => {
            let current = JSON.parse(localStorage.getItem("user"))?.nickname
            let res = s.data.results.filter((s) => s.nickname !== current)
            setSearch(res)
        })
        */
    }

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

    // search field value after submitting query
    const [partySearch, setPartySearch] = useState("")

    // tab value
    const [value, setValue] = useState(0)

    // search query result
    const [search, setSearch] = useState([])

    const handlePartyChange = (e) => {
        e.preventDefault()
        setPartySearch(e.target.value)
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
                //onChange={handleChange}
                aria-label="party tabs"
                variant="fullWidth"
            >
                <Tab label={"Buscar sala"} />
            </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
                <form
                    style={{
                        padding: "1rem 0",
                    }}
                    className="chat-input"
                    onSubmit={submitSearch}
                >
                    <TextField
                        autoFocus
                        placeholder="Introduce un código de búsqueda"
                        variant="outlined"
                        value={partySearch}
                        fullWidth
                        onChange={handlePartyChange}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        startIcon={
                            <Icon baseClassName="fas" className="fa-search" />
                        }
                    >
                        Submit
                    </Button>
                </form>
            </TabPanel>
    </Container>
  )
}

export default JoinPriv