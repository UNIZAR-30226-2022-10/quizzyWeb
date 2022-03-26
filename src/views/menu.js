import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper';

import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import { useNavigate } from "react-router-dom";

export default function Menu() {
  let navigate = useNavigate();
  function handleSolo(e) {
    navigate("/solo", { replace: true });
  }

  return (
    <Container  sx={{ display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'space-between' 
                }} 
                maxWidth="md">
      {/* SOLO */}       
      <Paper elevation={5}
        sx={{
          display: 'flex',
          flexDirection: 'column', 
          mb:2,
          p:2,
          borderRadius: '20px',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
              
        <h1> Solitario</h1> 
        <Button variant="contained" 
                onClick={handleSolo}
                color="success"
                size="large"
                sx={{ width:'50%', 
                      alignSelf: 'center',
                      backgroundColor: '#658C72'}}
                startIcon={<Icon baseClassName="fas" className="fa-circle-plus" />}
        >
          Nueva Partida
        </Button>
      </Paper>
      
      {/* MULTI */}
      <Paper elevation={5}
        sx={{
          display: 'flex',
          flexDirection: 'column', 
          mb:2,
          p:2,
          borderRadius: '20px',
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
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
                sx={{width:'50%', alignSelf: 'center',mb:2,backgroundColor:'#658C72'}}
                startIcon={<Icon baseClassName="fas" className="fa-globe" />}
        >
          Unirse a partida pública
        </Button>
        <Button variant="contained"
                color="success"
                size="large"
                sx={{width:'50%', alignSelf: 'center',mb:2,backgroundColor:'#658C72'}}
                startIcon={<Icon baseClassName="fas" className="fa-lock" />}
        >
          Unirse a partida privada
        </Button>
        <Button variant="contained" 
                color="success"
                size="large"
                sx={{width:'50%', alignSelf: 'center', mb:2,backgroundColor:'#658C72'}}
                startIcon={<Icon baseClassName="fas" className="fa-lock" />}
        >    
          Crear partida privada 
        </Button>
      </Paper>
    </Container>
  );
}