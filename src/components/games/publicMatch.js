import React from "react"
import { Grid, Card, Paper, Icon, Avatar } from "@mui/material"
import { Typography } from "@mui/material"
import userService from "services/userService"

function PublicMatch({ rid, players, winner }) {
    //PublicMatch contain players, winner

    return (
        <Paper
            sx={{
                backgroundColor: "primary.main",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "1rem",
                }}
            >
                <Typography xs={4} color="white">
                    Partida nº {rid}
                </Typography>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",

                        width: "20rem",
                    }}
                >
                    <Grid container alignItems="center">
                        {players.map((player, key) => {
                            return (
                                <Grid item xs={4} key={key}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            margin: "1rem",
                                        }}
                                    >
                                        <Avatar
                                            alt={player.nickname}
                                            src={
                                                process.env.PUBLIC_URL +
                                                "/images/cosmetics/cosmetic_" +
                                                player.actual_cosmetic +
                                                ".jpg"
                                            }
                                        />
                                        <Typography color="white">
                                            {player.nickname}
                                        </Typography>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            color: "yellow",
                        }}
                    >
                        <Icon baseClassName="fas" className="fa-crown" />
                    </div>
                    <Typography xs={4}>Ganador {winner}</Typography>
                </div>
            </div>
        </Paper>
    )
}

export default PublicMatch
