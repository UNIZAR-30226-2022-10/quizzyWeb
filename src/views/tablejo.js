import {useState, useRef, useEffect } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Dice from "react-dice-roll";

import ImageMapper from 'react-img-mapper';

const tablejoURL = process.env.PUBLIC_URL + '/images/tablejo.png';

export default function Tablejo() {
    const [dimY, setDimY] = useState(500);
    const [dimX, setDimX] = useState(1000);
    const ref = useRef();
    const [myTurn, setMyTurn] = useState(true);
    const [cases, setCases] = useState([1,3,5]);
    const [reachableCase, setReachableCase] = useState(undefined);

    const map = require('../utils/tablejomap.json')[0];
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
        window.addEventListener('resize', handleResize)
    }, [])

   
    return (
        <Grid container  
            sx={{height:'calc(100vh - 64px)', p: 1}}
        >
            <Grid id="ref" ref={ref}  
                item
                container
                xs={10}
                sx={{display:'flex', justifyContent:'center',backgroundColor:'accent.main', position:'relative'}}
            >                
                <ImageMapper
                    parentWidth={dimY*4/3}
                    responsive
                    src={tablejoURL}
                    map={reachableCase}
                    onClick={(area) => {
                        console.log(area.id);
                    }}
                />   
                {myTurn && 
                    <Box sx={{position:'absolute', bottom:'8px', right : '8px' }}>
                        <Dice size="75" cheatValue={2} rollingTime={1500}/>
                    </Box>
                }
            </Grid>
            <Grid item container direction={'column'} xs={2} sx={{backgroundColor:'light.main', alignContent:'center', justifyContent:'space-around',pt:2}}>
                <Grid item>
                    <Paper elevation={3} sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'blue'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/geography.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        0 - Geography
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'red'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/art.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        1 - Art
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper sx={{display:'flex',justifyContent:'center', alignItems:'center',  backgroundColor:'yellow'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/history.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        2 - History
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'green'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/science.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        3 - Science
                    </Paper>
                </Grid>
                <Grid item>
                    <Paper sx={{display:'flex',justifyContent:'center',alignItems:'center', backgroundColor:'orange'}}>
                        <Avatar
                            src={process.env.PUBLIC_URL + '/images/category/sports.png'}
                            alt="Avatar"
                            sx={{width: '50px', height: '50px'}}
                        />
                        4 - Sports
                    </Paper>
                </Grid>
                <Grid item>
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
