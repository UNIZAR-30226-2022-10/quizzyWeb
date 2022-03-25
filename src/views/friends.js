import { styled, useTheme} from '@mui/material/styles';

import Container from '@mui/material/Container'
import Box from '@mui/material/Box';
import Frame from '../components/Frame';


const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function Friends() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Frame />
      <Box component="main" sx={{flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Container  sx={{ display: 'flex', 
                          flexDirection: 'column',
                          justifyContent: 'space-between' 
                    }} 
                    maxWidth="md"
        >
         
          Friends
        
        </Container>
      </Box>
    </Box>
    
  );
}