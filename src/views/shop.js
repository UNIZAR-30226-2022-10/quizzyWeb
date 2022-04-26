import {useState, useEffect} from "react";
import { useForm } from "react-hook-form";


import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Icon from "@mui/material/Icon";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import shopService from 'services/shopService';

function srcset(id) {
    return {
        src: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_"+id+".jpg",
        srcSet: process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_"+id+".jpg",
    };
}

export default function Shop() {
    var [cosmetics, setCosmetics] = useState([]);
    var [wildcards, setWildcards] = useState([]);
    const [tab, setTab] = useState(0);
    const [amount, setAmount] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [chosen, setChosen] = useState(null);
    const [DialogCosmetic, setDialogCosmetic] = useState(false);
    const [DialogWildcard, setDialogWildcard] = useState(false);

    const { register, formState: { errors }, handleSubmit } = useForm({
        mode: "onChange" // "onChange"
    });

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };
    const handleConfirmCosmetic = (item) => {
        console.log("handleConfirmCosmetic", item);
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
        console.log("handleConfirmWildcard", item);
        if (!DialogWildcard) {
            setChosen(item);
            setDialogWildcard(true);
        }
        else {
            setChosen(null);
            setDialogWildcard(false);
        }
    }
    const handleBuyCosmetic = (id) => {
        shopService.buyCosmetics(id);
    };
    const handleBuyWildcard = (id, amount) => {
        shopService.buyWildcards(id, amount);
    };

    const total = () => {
        if (chosen) {
            if (tab === 0) {
                return JSON.parse(localStorage.getItem("user"))?.wallet - chosen.price;
            }
            else {
                return JSON.parse(localStorage.getItem("user"))?.wallet - chosen.price * amount;
            }
        }
        return 0;
    }

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    /* fetch cosmetics and wildcards list */
    useEffect(async () => {
        const resCosmetics = await shopService.getCosmetics()
        if (resCosmetics.ok && resCosmetics.cosmetics.length > 0) {
            setCosmetics(resCosmetics.cosmetics)
        }   
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! cosmetics not found')

        const resWildcards = await shopService.getWildcards()
        if (resWildcards.ok && resWildcards.wildcards.length > 0) {
            setWildcards(resWildcards.wildcards)
        }  
        else //TODO: DISPLAY ERROR MESSAGE
            console.log('Error ! wildcards not found')
    }, []);


    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
            maxWidth="md"
        >
            {/* Tab Headers */}
            <Tabs 
                value={tab} 
                onChange={handleChange} 
                centered 
                selectionFollowsFocus 
                sx={{   backgroundColor: 'accent.main', 
                        borderRadius:3, 
                        mb:1 
                    }}
            >
                <Tab icon={<Icon
                                baseClassName="fas"
                                className="fa-person-booth"
                            />} 
                    label="Cosmetics" 
                    {...a11yProps(0)}
                />
                <Tab 
                    icon={ <Icon
                                baseClassName="fas"
                                className="fa-medal"
                            />} 
                    label="Wildcards" 
                    {...a11yProps(1)}
                />
            </Tabs>

            {/* COSMETICS */}
            {tab === 0 &&
                <ImageList
                    sx={{
                        width: 2/3,
                        // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                        transform: 'translateZ(0)',
                        overflow: 'visible',
                    }}
                    rowHeight={236}
                    gap={1}
                >
                    {cosmetics.map((item) => {
                        return (
                            <ImageListItem 
                                key={'cosmetics' + item.cosmetic_id} 
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
                                    {...srcset(item.cosmetic_id)}
                                    alt={item.cosmetic_id}
                                    height='236'
                                    loading="lazy"
                                    className="rounded"
                                />
                                <ImageListItemBar
                                    sx={{
                                        padding:1,
                                        background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                                    }}
                                    title={item.cosmetic_id}
                                    subtitle={'Cost : '+item.price}
                                    position="bottom"
                                    actionIcon={
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ color: 'white', textTransform: 'capitalize', mr: 1 }}
                                            startIcon={ <Icon
                                                            baseClassName="fas"
                                                            className="fa-cart-plus"
                                                        />
                                            }
                                            onClick={() => {handleConfirmCosmetic(item)}}
                                        >
                                            Comprar
                                        </Button>
                                    }
                                    actionPosition="left"
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            }
            <Dialog open={DialogCosmetic} maxWidth="sm" fullWidth>
                <DialogTitle>Do you really want to buy this : </DialogTitle>
                <Box position="absolute" top={1} right={1}>
                    <Icon
                        color="error"
                        baseClassName="fas"
                        className="fa-close"
                        onClick={() => {handleConfirmCosmetic()}}
                    />
                </Box>
                <DialogContent>
                    <Typography> Actual wallet: {JSON.parse(localStorage.getItem("user"))?.wallet} </Typography>
                    <Typography> Cost: {chosen?.price} </Typography>
                    <Typography> Remaining after purchase: {total()}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={() => {handleConfirmCosmetic()}}>
                    No, cancel
                    </Button>
                    <Button color="success" variant="contained" onClick={() => {handleBuyCosmetic(chosen.wildcard_id)}}>
                    Yes, confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* WILDCARDS */}
            {tab === 1 &&
                <ImageList
                    sx={{
                        width: 2/3,
                        // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                        transform: 'translateZ(0)',
                        overflow: 'visible',
                    }}
                    gap={1}
                >
                    {wildcards.map((item) => {
                        return (
                            <ImageListItem 
                                key={'wildcard' + item.wildcard_id} 
                                cols={2} rows={1}
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
                                    {...srcset(item.wildcard_id)}
                                    alt={item.wildcard_id}
                                    loading="lazy"

                                />
                                <ImageListItemBar
                                    sx={{
                                        padding:1,
                                        background:
                                        'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, ' +
                                        'rgba(0,0,0,0.5) 70%, rgba(0,0,0,2) 100%)',
                                    }}
                                    title={item.description}
                                    subtitle={'Cost : '+item.price}
                                    position="bottom"
                                    actionIcon={
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ color: 'white', textTransform: 'capitalize', mr: 1 }}
                                            startIcon={ <Icon
                                                            baseClassName="fas"
                                                            className="fa-cart-plus"
                                                        />
                                            }
                                            onClick={() => {handleConfirmWildcard(item)}}
                                        >
                                            Comprar
                                        </Button>
                                    }
                                    actionPosition="left"
                                />
                            </ImageListItem>
                        );
                    })}
                </ImageList>
            }
            <Dialog open={DialogWildcard} maxWidth="sm" fullWidth>
                <DialogTitle>Do you really want to buy this :</DialogTitle>
                <Box position="absolute" top={1} right={1}>
                    <Icon
                        color="error"
                        baseClassName="fas"
                        className="fa-close"
                        onClick={() => {handleConfirmWildcard()}}
                    />
                </Box>
                <DialogContent>
                    <form onSubmit={handleSubmit()} > 
                        <label htmlFor="Amount">Amount:</label>
                        <input
                            type="number"
                            class="custominput"
                            min="1"
                            {...register("amount", {
                                required: {value: true, message: "Amount is required"},
                                valueAsNumber: {value: true, message: "Only number are accepted"},
                                min:{value: 1, message: "Amount must be greater than 0"},
                            })}
                            onChange={e => setAmount(e.target.value)}
                        />
                        <Typography variant="caption" color="error">
                            {errors.amount && errors.amount.message}
                        </Typography>
                    </form>
                    <Typography> Actual wallet: {JSON.parse(localStorage.getItem("user"))?.wallet} </Typography>
                    <Typography> Cost: {chosen?.price * amount} </Typography>
                    <Typography> Remaining after purchase: {total()} </Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={() => {handleConfirmWildcard()}}>
                    No, cancel
                    </Button>
                    <Button color="success" variant="contained" onClick={() => {handleBuyWildcard(chosen.wildcard_id, amount)}}>
                    Yes, confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}