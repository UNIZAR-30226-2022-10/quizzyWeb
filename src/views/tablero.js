import {useState, useRef, useEffect } from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Chat from '../components/chat/chat';
import Dice from "react-dice-roll";
import ImageMapper from 'react-img-mapper';

const tableroURL = process.env.PUBLIC_URL + '/images/tablero.png';

export default function Tablero() {
    const ref = useRef();

    const [dimY, setDimY] = useState(null);
    const [dimX, setDimX] = useState(null);
    const [myTurn, setMyTurn] = useState(false);
    const [cases, setCases] = useState([1,3,5]);
    const [reachableCase, setReachableCase] = useState(undefined);

    const map = require('../utils/tableroMap.json')[0];
    const filteredMap = () => {
        let mapcpy = JSON.parse(JSON.stringify(map));
        mapcpy.name = "filtered-map";
        mapcpy.areas = mapcpy.areas.filter(area => cases.includes(area.id));;
        return mapcpy
    }
    
    useEffect(() => {
        setReachableCase(filteredMap())
    },[cases])

    useEffect(() => {
        function handleResize() {
            setDimX(ref.current.clientWidth);
            setDimY(ref.current.clientHeight);
        }
        handleResize();

        // TODO: REPLACE THIS SIMULATION WITH REAL GAME
        setTimeout(() => {
            setMyTurn(true);
        }, 4000);
        setTimeout(() => {
            setCases([1,2,3,5])
        }, 10000);
        //
        window.addEventListener('resize', handleResize)
    }, [])
   
    return (
        <Grid container  
            sx={{height:'calc(100vh - 64px)', p: 1}}
        >
            {/* Tablero */}
            <Grid id="ref" ref={ref}  
                item
                container
                xs={12}
                lg={10}
                sx={{display:'flex', justifyContent:'center',backgroundColor:'accent.main', position:'relative'}}
            >                
                {reachableCase !== undefined && <ImageMapper
                    parentWidth={Math.min(dimY*4/3, dimX)}
                    responsive
                    src={tableroURL}
                    map={reachableCase}
                    onClick={(area) => {
                        console.log(area.id);
                    }}
                />   
                }
                {myTurn && 
                    <Box sx={{position:'absolute', bottom:8, right :8 }}>
                        <Dice size="75" cheatValue={2} rollingTime={1500}/>
                    </Box>
                }
                {/* Collapsible chat*/}
                <Accordion sx={{position:'absolute',my:1,bottom:0,left:0, zIndex:100}}>
                    <AccordionSummary
                        expandIcon={ <Icon baseClassName="fas" className="fa-angle-up"/>}
                        aria-controls="panel1a-content"
                        id="Chat Header"
                        sx={{backgroundColor:'secondary.main', color:'text.primary', display:'flex'}}
                    >
                        <Typography>Chat</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Chat />
                    </AccordionDetails>
                </Accordion>
            </Grid>
            {/* Side */}
            <Grid item container xs={12} lg={2} wrap="nowrap" sx={{flexDirection: { xs: "row", lg: "column"}, backgroundColor:'light.main', alignContent:'center', justifyContent:'space-around',pt:2}}>
                <Grid item xs={2} lg={12}>
                    <Paper elevation={3} sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'blue'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/geography.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        0 - Geography
                    </Paper>
                </Grid>
                <Grid item xs={2} lg={12}>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'red'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/art.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        1 - Art
                    </Paper>
                </Grid>
                <Grid item xs={2} lg={12}>
                    <Paper sx={{display:'flex',justifyContent:'center', alignItems:'center',  backgroundColor:'yellow'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/history.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        2 - History
                    </Paper>
                </Grid>
                <Grid item xs={2} lg={12}>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'green'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/science.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        3 - Science
                    </Paper>
                </Grid>
                <Grid item xs={2} lg={12}>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'orange'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/sports.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        4 - Sports
                    </Paper>
                </Grid>
                <Grid item xs={2} lg={12}>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'purple'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/entertainment.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        5 - Entertainment
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
}
