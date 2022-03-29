/*
 * Author: - Mathis
 * Filename: - question.js
 * Module: - Games
 * Description: - Display a question and the answers from the API 
 */

import React from 'react'
import { styled } from '@mui/material/styles';
import axios from 'axios'

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import Loader from './Loader'

import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'


const queryClient = new QueryClient()

const CustomLinearProgress = styled(LinearProgress)({
  height:'15px',
  borderRadius:'20px',
  transform: 'rotate(180deg)',
  background: 'linear-gradient(90deg, rgba(1,213,0,1) 0%,rgba(236,102,0,1) 84%, rgba(199,0,0,1) 100%)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#000000',
    backgroundImage: 'linear-gradient(315deg, #000000 0%, #414141 74%)',
    
  },
});

const CustomBox = styled(Box)({
  backgroundImage: 'linear-gradient(to right, #757F9A 0%, #D7DDE8  51%, #757F9A  100%)',
  transition: '0.3s',
  height: '100%',
  m:4, 
  borderRadius:'10px',
  '&:hover': {
   backgroundPosition: 'right center', /* change the direction of the change here */
   color: '#fff',
   boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
  }
});

export default function Question(props) {
  return (
    <QueryClientProvider client={queryClient}>
      <Content difficulty={props.difficulty} timer={props.timer} />
    </QueryClientProvider>
  )
}

function Content(props) {
  const queryClient = useQueryClient()
  const [intervalS, setIntervalMs] = React.useState(props.timer)
  const [progress, setProgress] = React.useState(0);

  // Query question
  const { status, data, error, isFetching, refetch } = useQuery(
    'question',
    async () => {
      const res = await axios.get('https://opentdb.com/api.php?amount=1')
      handleTimer()
      return res.data
    },
      
  )
  
  // Timer
  var timer = 0;
  const tick = 400; //Refresh every X ms
  var diff = (tick*100)/ (intervalS*1000); // diff each tick
  const handleTimer = () => {
    setProgress(0)
    timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
        }
        return Math.min(oldProgress + diff, 100);
      });
    }, tick);
  };
  // Called when the compoonent is unmounted
  React.useEffect(() => { 
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Game Settings
  

  // ERROR QUERY GESTION
  if (status === 'loading') return <Loader/>
  if (status === 'error') return <span>Error: {error.message}</span>

  return (
    <QueryClientProvider client={queryClient}>
       <div >
        <p>Difficulty is set to : {props.difficulty}</p> 
        <label>
          Time available (s):{' '}
          <input
            value={intervalS}
            onChange={ev => setIntervalMs(Number(ev.target.value))}
            type="number"
          />{' '}
          <span
            style={{
              display: 'inline-block',
              marginLeft: '.5rem',
              width: 10,
              height: 10,
              background: isFetching ? 'green' : 'transparent',
              transition: !isFetching ? 'all .3s ease' : 'none',
              borderRadius: '100%',
              transform: 'scale(2)',
            }}
          />
        </label>
        <Container maxWidth="md">
            <>
              {data.results.map(item => (
                <>
                <Card raised>
                  <CardHeader
                    title={item.category}
                    subheader={item.difficulty}
                    titleTypographyProps={{ align: 'start'}}
                    subheaderTypographyProps={{ align: 'start' }}
                    sx ={{
                      textTransform: 'capitalize',
                      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
                    }}
                  />
                
                  <CardContent>
                    <Paper elevation={3}
                      sx={{
                       overflow: 'hidden',
                        mb:2,
                        width:'100%',
                        borderRadius: '20px',
                      }}
                    > 
                      <Typography variant="h5" sx={{p:2}}>{item.question} </Typography> 
                      {/* TIMER */}
                      <Box sx={{ position:'relative', bottom:0}}>
                        <CustomLinearProgress 
                          variant="determinate" 
                          value={progress}
                        />
                      </Box>
                    </Paper>

                    <Grid container spacing={2}>
                      
                      {
                        item.incorrect_answers.map((answer) => (
                          <Grid item xs={6}>
                            <CustomBox key={answer}>
                              <Typography 
                                variant="h6" 
                                align="center" 
                                sx={{display:'flex',flexDirection:'column',alignItems:'center',}}
                              >
                                {answer} 
                              </Typography> 
                            </CustomBox>
                          </Grid>
                        ))
                      }
                      
                      <Grid item xs={6}>
                        <CustomBox key={item.correct_answer}>
                          <Typography variant="h6" align="center">
                            {item.correct_answer}
                          </Typography> 
                        </CustomBox>
                      </Grid>
      
                    </Grid>  
                  </CardContent>

                  <CardActions>
                    <Button onClick={refetch}
                      disabled={progress !== 100}
                      variant="contained" 
                      color="success"
                      fullWidth
                    > 
                      Next Question 
                    </Button>
                    
                  </CardActions>
                </Card>        
                </>
                
              ))}
            </>
        </Container>
          
      
        <ReactQueryDevtools initialIsOpen />
      </div>
    </QueryClientProvider>
   
  )
}





