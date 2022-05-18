import {useState, useEffect} from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "react-query";

import AppBar from '@mui/material/AppBar';
import Alert from '@mui/material/Alert';
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Icon from "@mui/material/Icon";
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import InputLabel from "@mui/material/InputLabel";
import Grid from '@mui/material/Grid';
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from '@mui/material/Typography';

import shopService from 'services/shopService';
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
    const [user,setUser] = useOutletContext();
    var [cosmetics, setCosmetics] = useState([]);
    var [possessedCosmetics, setPossessedCosmetics] = useState([]);
    var [possessedWildcards, setPossessedWildcards] = useState([]);
    var [wildcards, setWildcards] = useState([]);
    const [amount, setAmount] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [chosen, setChosen] = useState(null);
    const [DialogCosmetic, setDialogCosmetic] = useState(false);
    const [DialogWildcard, setDialogWildcard] = useState(false);

    // fetch cosmetics and wildcards
    async function fetchCosmetics() {
        setLoading(true);
        const resCosmetics = await shopService.getCosmetics()
        if (resCosmetics.ok && resCosmetics.cosmetics.length > 0) {
            setCosmetics(resCosmetics.cosmetics)
        }   
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Este cosmético no existe');

        const resPossessedCosmetics = await userService.getCosmetics()
        if (resPossessedCosmetics.ok && resPossessedCosmetics.cosmetics.length > 0) {
            setPossessedCosmetics(resPossessedCosmetics.cosmetics)
        }   
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Este cosmético no existe')
       
        setLoading(false);
    }
    async function fetchWildcards() {
        setLoading(true);
        const resWildcards = await shopService.getWildcards()
        if (resWildcards.ok && resWildcards.wildcards.length > 0) {
            setWildcards(resWildcards.wildcards)
        }  
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! wildcards not found')
        
        const resPossessedWildcards = await userService.getWildcards()
        if (resPossessedWildcards.ok && resPossessedWildcards.wildcards.length > 0) {
            setPossessedWildcards(resPossessedWildcards.wildcards)
        }  
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! wildcards not found')
        setLoading(false);
    } 

    // fetch and sync user
    const {
        isLoading,
        error: errorUser,
        data: userData,
        refetch: refetchUser,
    } = useQuery("user", userService.getUser)
    useEffect(() => {
        if (userData) {
            setUser(userData.data)
        }
    }, [userData])

    const handleConfirmCosmetic = (item) => {
        setLoading(false)
        setAmount(-1)
        if (!DialogCosmetic) {
            setChosen(item);
            setDialogCosmetic(true);
        }
        else {
            setChosen(null);
            setDialogCosmetic(false);
        }
    }
    const handleConfirmWildcard = (item) => {
        setLoading(false)
        setAmount(1)
        if (!DialogWildcard) {
            setChosen(item);
            setDialogWildcard(true);
        }
        else {
            setChosen(null);
            setDialogWildcard(false);
        }
    }
    const handleBuyCosmetic = async (id) => {
        setLoading(true);
        await shopService.buyCosmetics(id)
        .then(response => {
            if (response.status === 200) {
                // Refresh cosmetics
                fetchCosmetics();
                //Close dialog
                handleConfirmCosmetic()
                //Display success message
                setSuccess("¡Compra realizada!")
            }
            else {
                setError("¡Error al comprar el artículo!")
            }
        })
        .catch(error => {
            console.log(error.response.data.msg || error.response.data.message || error)
            setError("Error en la respuesta")
            
        })
        .finally(() => {
            refetchUser();
        })
        setLoading(false);
    };
    const handleBuyWildcard = async (id, amount) => {
        setLoading(true);
        await shopService.buyWildcards(id, amount).then(response => {
            if (response.status === 200) {
                // Refresh wildcards
                fetchWildcards();
                //Close dialog
                handleConfirmWildcard()
                //Display success message
                setSuccess("Compra realizada !!")
            }
            else {
                console.log('Error ! buying failed')
                setError("Error ! buying failed")
            }
        })
        .catch(error => {
            console.log(error.response.data.msg || error.response.data.message || error)
            setError("Error ! buying failed")
            
        })
        .finally(() => {
            refetchUser();
        })
        setLoading(false);
    };

    useEffect(() => {
        if (chosen) {
            if (amount > 0) {
                setTotal(user?.wallet - chosen.price * amount)
            }
            else {
                setTotal(user?.wallet - chosen.price)
            }
        }
    }, [chosen, amount]);

    /* fetch cosmetics and wildcards list */
    useEffect(() => {
        //TODO: DISPLAY LOADER DURING FETCH
        setLoading(true);
        fetchWildcards();
        fetchCosmetics();
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
            {/* Comodines */}
            <Grid container sx={{justifyContent:'start'}}>
                {/* Header */}
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
                {/* Wildcard Items */}
                {wildcards.map((item) => {
                    return (
                        <Grid item key={"shop-wildcard-"+item.wildcard_id}>
                            <Tooltip title={item.description}>
                                <Badge
                                    overlap="circular"
                                    badgeContent={
                                        possessedWildcards.some(wc => wc.wildcard_id === item.wildcard_id) 
                                        ?   possessedWildcards.find(wc => wc.wildcard_id === item.wildcard_id).cuantity
                                        :   0
                                    }
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    showZero
                                    color="primary"
                                >
                                    <ImageListItem
                                        className={possessedWildcards.some(wc => wc.cosmetic_id === item.cosmetic_id) ? "equipped" : ""}
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
                                                'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, ' +
                                                'rgba(0,0,0,0.5) 70%, rgba(0,0,0,2) 100%)',
                                            }}
                                            title={item.description}
                                            subtitle={'Cost : '+item.price}
                                            position="bottom"
                                            actionIcon={
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ color: 'white', mr: 1 }}
                                                    onClick={() => {handleConfirmWildcard(item)}}
                                                >
                                                    <Icon
                                                        baseClassName="fas"
                                                        className="fa-cart-plus"
                                                    />
                                                </Button>
                                            }
                                            actionPosition="left"
                                        />
                                    </ImageListItem>
                                </Badge>
                            </Tooltip>
                        </Grid>
                    );
                })}
                {/* Wildcard Dialog */}
                <Dialog open={DialogWildcard} maxWidth="sm" fullWidth>
                    <DialogTitle>Do you really want to buy : 
                        <Box sx={{textAlign: 'center', fontWeight:'bold'}}>
                            {chosen?.description}
                        </Box>
                    </DialogTitle>
                    <Box position="absolute" top={1} right={1}>
                        <Icon
                            color="error"
                            baseClassName="fas"
                            className="fa-close"
                            onClick={() => {handleConfirmWildcard()}}
                        />
                    </Box>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        

                            <InputLabel id="amount">
                                <Typography> Amount </Typography>
                            </InputLabel>

                            <TextField 
                                required
                                type="number"
                                defaultValue={1}
                                InputProps={{
                                    inputProps: { 
                                        max: 50, min: 1
                                    }
                                }}
                                onChange={(e) => {setAmount(parseInt(e.target.value))}}
                            />
                    
                            <Typography> Actual wallet: {user?.wallet} </Typography>
                            <Typography> Cost: {chosen?.price * amount} </Typography>
                            <Typography> Remaining after purchase: {total} </Typography>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="error" variant="contained" 
                            onClick={() => {handleConfirmWildcard()}}
                        >
                            No, cancel
                        </Button>
                        <Button 
                            color="success" variant="contained" 
                            disabled={total<0} 
                            onClick={() => {handleBuyWildcard(chosen.wildcard_id, amount)}}
                        >
                            {loading ? <CircularProgress size={25} color="light" /> : 'Yes, confirm'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            {/* Comodines */}
            <Grid container sx={{justifyContent:'space-around'}}>
                {/* Header */}
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
                {/* Cosmetic Items */}
                {cosmetics.map((item) => {
                    return (
                        <Grid item key={"shop-cosmetic-"+item.cosmetic_id}>
                            <Tooltip title={item.cname}>
                                <ImageListItem 
                                    className={possessedCosmetics.some(wc => wc.cosmetic_id === item.cosmetic_id) ? "equipped" : ""}
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
                                        className={possessedCosmetics.some( wc => wc.cosmetic_id === item.cosmetic_id) ? "equipped" : ""}
                                        sx={{
                                            background:
                                            'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, ' +
                                            'rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.2) 100%)',
                                        }}
                                        title={item.cname}
                                        subtitle={'Cost : '+item.price}
                                        position="bottom"
                                        actionIcon={
                                            <Button
                                                disabled={possessedCosmetics.some(wc => wc.cosmetic_id === item.cosmetic_id)}
                                                variant="contained"
                                                color="secondary"
                                                sx={{ color: 'white'}}
                                                startIcon={ <Icon
                                                                baseClassName="fas"
                                                                className="fa-cart-plus"
                                                            />
                                                }
                                                onClick={() => {handleConfirmCosmetic(item)}}
                                            >
                                                { 
                                                    possessedCosmetics.some(cm => cm.cosmetic_id === item.cosmetic_id) 
                                                    ?   "Poseedo"
                                                    :   "Comprar"
                                                } 
                                            </Button>
                                        }
                                        actionPosition="left"
                                    />
                                </ImageListItem>
                            </Tooltip>
                        </Grid>
                    );
                })}
                {/* Cosmetic Dialog */}
                <Dialog 
                    open={DialogCosmetic} 
                    maxWidth="sm" 
                    fullWidth
                >
                    <DialogTitle>Do you really want to buy :
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
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography> Actual wallet: {user?.wallet} </Typography>
                        <Typography> Cost: {chosen?.price} </Typography>
                        <Typography> Remaining after purchase: {total}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="error" variant="contained" 
                            onClick={() => {handleConfirmCosmetic()}}
                        >
                            No, cancel
                        </Button>
                        <Button
                            color="success" variant="contained" 
                            disabled={total<0} 
                            onClick={() => {handleBuyCosmetic(chosen.cosmetic_id)}}
                        >
                            {loading ? <CircularProgress size={25} color="light"/> : 'Yes, confirm'}
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