import {useState, useEffect} from "react";

import Alert from "@mui/material/Alert"
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Icon from "@mui/material/Icon";
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Grid from '@mui/material/Grid';
import Snackbar from "@mui/material/Snackbar";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';


import userService from 'services/userService';

function cosmeticssrcSet(id) {
    return {
        src: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_"+id+".jpg",

        srcSet: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_"+id+".jpg",
    };
}
function comodinesrcSet(id) {
    return {
        src: process.env.PUBLIC_URL + "/images/comodines/unknown.jpg",
        srcSet: process.env.PUBLIC_URL + "/images/comodines/unknown.jpg",
    };
}

export default function Shop() {
    var [cosmetics, setCosmetics] = useState([]);
    var [wildcards, setWildcards] = useState([]);
    const [equipped, setEquipped] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [chosen, setChosen] = useState(null);
    const [DialogCosmetic, setDialogCosmetic] = useState(false);

    const handleConfirmCosmetic = (item) => {
        setLoading(false)
        if (!DialogCosmetic) {
            setChosen(item);
            setDialogCosmetic(true);
        }
        else {
            setChosen(null);
            setDialogCosmetic(false);
        }
    }
    const handleEquipCosmetic = (id) => {
        setLoading(true);
        userService.equipCosmetic(id)
            .then(res => {
                if (res.ok) {
                    setChosen(null);
                    setDialogCosmetic(false);
                    setEquipped(id);
                    setSuccess("Cosmético equipado correctamente");
                }
                else {
                    setError(res.msg);
                }
            })
            .catch(err => {
                console.log(err)
                setError(err.response.data.msg || err.response.data.message || err );
            })
            setLoading(false);
    }

    async function fetchCosmetics() {
        const resCosmetics = await userService.getCosmetics()
        if (resCosmetics.ok && resCosmetics.cosmetics.length > 0) {
            setCosmetics(resCosmetics.cosmetics)
        }   
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! cosmetics not found')
    }
    async function fetchWildcards() {
        const resWildcards = await userService.getWildcards()
        if (resWildcards.ok && resWildcards.wildcards.length > 0) {
            setWildcards(resWildcards.wildcards)
        }  
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! wildcards not found')
        
        const resEquipped = JSON.parse(localStorage.getItem('user'))?.actual_cosmetic;
        setEquipped(resEquipped || 1);
    }

    /* fetch cosmetics and wildcards list of the user */
    useEffect(() => {
        setLoading(true);
        fetchCosmetics();
        fetchWildcards();
        setLoading(false);
    }, []);


    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
            }}
            maxWidth="md"
        >
            {/* Tab Headers */}
            <Grid container sx={{justifyContent:'start'}}>
                <Grid item xs={12}>
                    <AppBar position="static" color="accent">
                        <Toolbar>
                            <Icon
                                baseClassName="fas"
                                className="fa-person-booth"
                            />
                            <Typography variant="h5" sx={{ml:2}}>
                                Comodines
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Grid>
                
                {wildcards.map((item) => {
                    return (
                        <Grid item>
                            <Tooltip title={item.description}>
                            <Badge
                                overlap="circular"
                                badgeContent={item.cuantity}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                color="primary"
                                
                            >
                                <ImageListItem 
                                    key={'coll-wildcard-' + item.wildcard_id}
                                    sx={{
                                        border: 'solid',
                                        margin: 1,
                                        borderRadius: '10%',
                                        borderColor: 'accent.main',
                                        transition: 'all 0.2s ease-in-out',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.4)',
                                        },
                                        height: '100%',
                                        
                                    }}
                                >
                                   
                                    <img
                                        {...comodinesrcSet(item.wildcard_id)}
                                        alt={item.wildcard_id}
                                        loading="lazy"

                                    />
                                     
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, ' +
                                            'rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 100%)',
                                        }}
                                        title={item.description}
                                        position="bottom"
                                        actionIcon={
                                           
                                                <Icon
                                                    sx={{color:'white'}}
                                                    baseClassName="fas"
                                                    className="fa-medal"
                                                />
                                        }
                                        actionPosition="left"
                                    />
                                    
                                </ImageListItem>
                            </Badge>
                            </Tooltip>
                        </Grid>
                    );
                })}
            </Grid>

            <Grid container sx={{justifyContent:'space-around'}}>
                <Grid item xs={12}>
                    <AppBar position="static" color="accent">
                        <Toolbar>
                            <Icon
                                baseClassName="fas"
                                className="fa-medal"
                            />
                            <Typography variant="h5" sx={{ml:2}}>
                                Cosmeticos
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </Grid>

                {cosmetics.map((item) => {
                        return (
                            <Grid item>
                            <Tooltip title={item.cname}>
                                <ImageListItem 
                                    key={'coll-cosmetics-' + item.cosmetic_id} 
                                    cols={1} rows={1} 
                                    sx={{
                                        border: 'solid',
                                        margin: 1,
                                        borderRadius: '10%',
                                        borderColor: 'accent.main',
                                        transition: 'all 0.2s ease-in-out',
                                        overflow: 'hidden',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0px 0px 10px rgba(0,0,0,0.4)',
                                        }
                                        
                                    }}
                                    
                                >
                                    <img
                                        {...cosmeticssrcSet(item.cosmetic_id)}
                                        alt={item.cosmetic_id}
                                        height='236'
                                        loading="lazy"
                                        className="rounded"
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, ' +
                                            'rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 100%)',
                                        }}
                                        title={item.cname}
                                        position="bottom"
                                        actionIcon={
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ color: 'white', textTransform: 'capitalize', mr: 1 }}
                                                startIcon={ equipped === item.cosmetic_id ? <Icon
                                                                baseClassName="fas"
                                                                className="fa-square-check"
                                                            /> : ""
                                                        }
                                                onClick={() => {handleConfirmCosmetic(item)}}
                                            >
                                                Equipar
                                            </Button>
                                        }
                                        actionPosition="left"
                                    />
                                </ImageListItem>
                            </Tooltip>
                            </Grid>
                        );
                })}
        
                <Dialog open={DialogCosmetic} maxWidth="sm" fullWidth>
                    <DialogTitle>Equipar este cosmetico :
                        <Box sx={{textAlign: 'center', fontWeight:'bold'}}>
                            {chosen?.cname}
                        </Box>
                    </DialogTitle>
                    <Box position="absolute" top={1} right={1}>
                        <Icon
                            color="error"
                            baseClassName="fas"
                            className="fa-close"
                            onClick={() => {handleConfirmCosmetic()}}
                        />
                    </Box>
                    <DialogActions sx={{alignSelf:'center'}}>
                        <Button color="error" variant="contained" onClick={() => {handleConfirmCosmetic()}}>
                        No, cancel
                        </Button>
                        <Button color="success" variant="contained" onClick={() => {handleEquipCosmetic(chosen.cosmetic_id)}}>
                            {loading ? <CircularProgress size={25} color="light"/> : 'Yes, confirm (Not Implement Yet)'} 
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>

            {/* Success snackbar */}
            <Snackbar open={success !== false} autoHideDuration={6000} onClose={() =>setSuccess(false)}>
                <Alert onClose={() =>setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    {success}
                </Alert>
            </Snackbar>
            {/* Error snackbar */}
            <Snackbar open={error !== false} autoHideDuration={6000} onClose={() =>setError(false)}>
                <Alert onClose={() => setSuccess(false)} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}