import React from 'react'
import { 
    Grid, 
    Card, 
    Paper,
    Icon,
    Avatar
} from '@mui/material'
import { Typography } from '@mui/material'

function PublicMatch({ rid, players, winner }) {
    //PublicMatch contain players, winner

  return (
    <Paper
        sx={{
            backgroundColor: "primary.main"
        }}
    >
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem"
            }}
        >
            <Typography 
                xs={4}
                color="white"
            >
                Partida nº {rid}
            </Typography>
            <div
                style={{
                    display: "flex",
                    gap:"10px"
                }}
            >
                <Grid
                    container
                    alignItems="center"
                    justifyContent="center"
                >
                    {players.map((item, key) => (
                        <Grid 
                            item
                            xs={4} 
                            key={key}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center"
                                }}
                            >
                                <Avatar alt={item.nickname} src={process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_" + item?.actual_cosmetic + ".jpg"} />
                                <Typography
                                    color="white">
                                    {item.nickname}
                                </Typography>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <div
                style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    color:"white",
                    gap:"10px"
                }}
            >
                <div
                    style={{
                        color : "yellow"
                    }}
                >
                    <Icon baseClassName="fas" className="fa-crown" />
                </div>
                <Typography
                    xs={4}
                >
                    Ganador {winner}
                </Typography>
            </div>
        </div>
    </Paper>
  )
}

export default PublicMatch