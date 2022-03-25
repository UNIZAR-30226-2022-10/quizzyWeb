import { styled, useTheme} from '@mui/material/styles';

import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'

import Frame from '../components/Frame';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function Menu() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Frame />
      <Box component="main" sx={{flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container  sx={{ display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'space-between' 
                    }} 
                    maxWidth="md">
          {/* SOLO */}       
          <Paper elevation={10}
            sx={{
              display: 'flex',
              flexDirection: 'column', 
              mb:2,
              p:2,
              borderRadius: '20px',
              backgroundColor: 'primary.dark',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
                  
            <h1> Solitario</h1> 
            <Button variant="contained" 
                    color="success"
                    size="large"
                    sx={{width:'50%', alignSelf: 'center'}}
                    startIcon={<Icon baseClassName="fas" className="fa-circle-plus" />}
            >
              Nueva Partida
            </Button>
          </Paper>
         
          {/* MULTI */}
          <Paper elevation={10}
            sx={{
              display: 'flex',
              flexDirection: 'column', 
              mb:2,
              p:2,
              borderRadius: '20px',
              backgroundColor: 'primary.dark',
              '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
              },
            }}
          >
                  
            <h1> Multi </h1> 
            <Button variant="contained" 
                    color="success"
                    size="large"
                    sx={{width:'50%', alignSelf: 'center',mb:2}}
                    startIcon={<Icon baseClassName="fas" className="fa-globe" />}
            >
              Unirse a partida pública
            </Button>
            <Button variant="contained" 
                    color="success"
                    size="large"
                    sx={{width:'50%', alignSelf: 'center',mb:2}}
                    startIcon={<Icon baseClassName="fas" className="fa-lock" />}
            >
              Unirse a partida privada
            </Button>
            <Button variant="contained" 
                    color="success"
                    size="large"
                    sx={{width:'50%', alignSelf: 'center', mb:2}}
                    startIcon={<Icon baseClassName="fas" className="fa-lock" />}
            >    
              Crear partida pública
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
    
  );
}