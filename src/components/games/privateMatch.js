import React from "react"
import { Paper, Grid, Typography, Avatar, Icon } from "@mui/material"

function PrivateMatch({ rid, time, difficulty, help, players, winner }) {
    //PrivateMatch contain players, winner, configuration
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
                        flexDirection: "column",
                        marginLeft: "15px",
                        gap: "10px",
                    }}
                >
                    <Typography xs={4} color="white">
                        Tiempo: {time} s
                    </Typography>
                    <Typography xs={4} color="white">
                        Dificultad: {difficulty}
                    </Typography>
                    <div
                        style={{
                            display : "flex",
                            alignItems : "center",
                            gap : "4px"
                        }}>
                        <Typography xs={4} color="white">
                            Comodines:
                        </Typography>
                        <>
                            {help ? (
                                <Icon
                                    baseClassName="fas"
                                    color="success"
                                    className="fa-check"
                                />
                            ) : (
                                <Icon
                                    baseClassName="fas"
                                    color="error"
                                    className="fa-xmark"
                                />
                            )}
                        </>
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        width: "20rem",
                    }}
                >
                    <Grid container alignItems="center">
                        {players.map((item, key) => (
                            <Grid item xs={4} key={key}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        alt={item.nickname}
                                        src={
                                            process.env.PUBLIC_URL +
                                            "/images/cosmetics/cosmetic_" +
                                            item?.actual_cosmetic +
                                            ".jpg"
                                        }
                                    />
                                    <Typography color="white">
                                        {item.nickname}
                                    </Typography>
                                </div>
                            </Grid>
                        ))}
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

export default PrivateMatch
