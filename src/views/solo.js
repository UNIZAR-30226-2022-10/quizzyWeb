import * as React from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';


import Typography from '@mui/material/Typography';

import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';

import Question from '../components/question'
import '../css/solo.css';
const difficulties = [
  {
    title: 'Easy',
    description: [
      'Lorem Ipsum',
    ],
    icon:'fa-baby',
  },
  {
    title: 'Medium',
    description: [
      'Lorem Ipsum',
    ],
    icon:'fa-user',
  },
  {
    title: 'Hard',
    description: [
      'Lorem Ipsum',
    ],
    icon:'fa-skull',
  }
];

function Solo() {
  var [start,setStart] = React.useState(false);
  var [difficulty,setDifficulty] = React.useState('Medium');
  function handleStart(e,difficulty) {
    setStart(true);
    console.log(difficulty);
    setDifficulty(difficulty);
  }

  if (start === true) return <Question difficulty={difficulty} timer="10"/>

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Juego Solitario
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} justifyContent="center" >
          {difficulties.map((d) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={d.title}
              xs={12}
              sm={6}
              md={4}
            >
              <Card >
              <CardHeader
                  className={d.title}
                  title={d.title}
                  titleTypographyProps={{ align: 'center' }}
                  action={ <Icon baseClassName="fas" className={d.icon} />}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                />
               
                <CardContent>
                  <ul>
                    {d.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button fullWidth 
                    color="primary" 
                    variant='outlined' 
                    onClick={(e) => handleStart(e,d.title)}>
                    Start {d.title}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* End footer */}
    </React.Fragment>
  );
}
export default Solo;