import {useState, useRef, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";

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
import ImageMapper from '../imgMapper/ImageMapper';
import {tableroCoords, tableroMap} from '../imgMapper/tableroMap.js';

const tableroURL = process.env.PUBLIC_URL + '/images/tablero.png';

export default function Tablero() {
    const [user,setUser] = useOutletContext();
    const gridRef = useRef();
    const [playersPos,setPlayersPos] = useState([0,2,4,6]);
    const [loading, setLoading] = useState(false);
    const [dimY, setDimY] = useState(null);
    const [dimX, setDimX] = useState(null);
    const [myTurn, setMyTurn] = useState(false);
    const [cases, setCases] = useState([0]);

    const [map, setMap] = useState(tableroMap);
    // Set reachable case in map
    useEffect(() => {
        setMap((prevState) => ({
            ...prevState,
            areas: 
                tableroMap.areas.filter(area => cases.includes(area.id) || area.shape === "player").concat(...prevState.areas.slice(-playersPos.length))
        }));
    },[cases])
    // Set players position in map
    useEffect(() => {
        let newPlayersPos = []
        const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"]
        playersPos.forEach((pos,index) => {
            newPlayersPos.push({
                "id": "player-" + index, 
                "shape": "player", 
                "coords": tableroCoords[pos],
                "preFillColor": "rgba(0,0,0,0.3)",
                "fillColor": "blue",
                "strokeColor": colors[index],
                "lineWidth": 6,
                "cosmeticId": index+1,
            })
        })
        setMap((prevState) => ({
            ...prevState,
            areas: [
                ...prevState.areas.slice(0,cases.length).concat(newPlayersPos)   
            ]
        })); 
    },[playersPos])

    useEffect(() => {
        function handleResize() {
            setLoading(true);
            setDimX(gridRef.current.clientWidth);
            setDimY(gridRef.current.clientHeight);
            setLoading(false);
        }
        handleResize();
        window.addEventListener('resize', handleResize)

        // TODO: REPLACE THIS SIMULATION WITH REAL GAME
        // Set player turn to true
        setTimeout(() => {
            setMyTurn(true);
        }, 1000);
        //randomly set 0 to 5 random cases reachable
        setInterval(() => {
            //generate array of random length between 0 and 5 of values between 0 to 54
            setCases(Array(Math.floor(Math.random() * 5) + 1).fill(0).map(() => Math.floor(Math.random() * 54)));
        }, 5000);
        //randomly change or not position of players between 0 and 54 each 7s
        setInterval(() => {
            setPlayersPos((prevState) => {
                
                let newPlayersPos = prevState.map((pos) => {
                    if(Math.random() > 0.5) {
                        return Math.floor(Math.random() * 54);
                    }
                    return pos;
                })   
                return newPlayersPos;     
            })
        }, 7000);
    }, [])
   
    return (
        <Grid container
            direction={{ xs: 'column', lg: 'row' }}
            sx={{height:'calc(100vh - 64px)', p: 1}}
        >
            {/* Tablero */}
            <Grid 
                id="gridRef" 
                ref={gridRef}  
                item
                xs
                lg={10}
                container
                sx={{display:'flex', justifyContent:'center',backgroundColor:'accent.main', position:'relative'}}
            >           
                {map !== undefined && !loading && <ImageMapper
                    id="map"
                    parentWidth={Math.min(dimY*4/3, dimX)}
                    responsive
                    src={tableroURL}
                    map={map}
                    onClick={(area) => {
                        if (area.shape === "player") {
                            console.log("Clicked on :", area.id)
                        } else {
                            console.log("Clicked on case :",area.id )
                        }
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
            <Grid item container lg={2} wrap="nowrap" sx={{flexDirection: { xs: "row", lg: "column"}, backgroundColor:'light.main', alignContent:'center', justifyContent:'space-around',pt:2}}>
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
