import React from 'react'
import { styled } from '@mui/material/styles';
import axios from 'axios'

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { Button } from '@mui/material';

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
  height:'10px',
  borderRadius:'10px',
  transform: 'rotate(180deg)',
  background: 'rgb(1,213,0)',
  background: 'linear-gradient(90deg, rgba(1,213,0,1) 0%,\
               rgba(236,102,0,1) 84%, rgba(199,0,0,1) 100%)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#000000',
    backgroundImage: 'linear-gradient(315deg, #000000 0%, #414141 74%)',
    
  },
});


export default function Question() {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />
    </QueryClientProvider>
  )
}

function Content() {
  const queryClient = useQueryClient()
  const [intervalS, setIntervalMs] = React.useState(5)
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

  // ERROR QUERY GESTION
  if (status === 'loading') return <Loader/>
  if (status === 'error') return <span>Error: {error.message}</span>

  return (
    <QueryClientProvider client={queryClient}>
       <div >
        <Button onClick={refetch}
                disabled={progress != 100}
                variant="contained" 
                color="success"> 
          Next Question 
        </Button>
        <p>{progress}</p>   
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
        {/* QUESTION */}
        <h2>Question</h2>
        {/* TIMER */}
        <Box sx={{ width: '100%' }}>
          <CustomLinearProgress 
            variant="determinate" 
            value={progress}
          />
        </Box>
        {/* ANSWERS */}
        <ul>
          {data.results.map(item => (
            <>
              <li key={item.category}>{item.category} - {item.difficulty} </li>
              <h3 d> {item.question} </h3>
              <ul>
                {
                  item.incorrect_answers.map((answer) => (
                    <li key={answer}>{answer}</li>
                  ))
                }
                <li key={item.correct_answer}>{item.correct_answer}</li>
              </ul>
            </>
          ))}
        </ul>
      
        <ReactQueryDevtools initialIsOpen />
      </div>
    </QueryClientProvider>
   
  )
}
