import Container from "@mui/material/Container"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"

var imgs = ["pc", "corner"]
var randomImg = imgs[Math.floor(Math.random() * imgs.length)]

export default function Error(props) {
    return (
        <Container
            sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            maxWidth="md"
        >
            <Card sx={{ maxWidth: 497 }} elevation={0}>
                <CardMedia
                    component="img"
                    height="373"
                    image={
                        process.env.PUBLIC_URL +
                        "/images/error/" +
                        randomImg +
                        ".gif"
                    }
                />
                <CardContent sx={{ backgroundColor: "#fcf0e4" }}>
                    <Typography variant="h3" color="text.secondary">
                       Error :  
                        { props.message 
                            ? props.message
                            : ' Pusheen no pudo encontrar esta página :('
                        }
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    )
}
