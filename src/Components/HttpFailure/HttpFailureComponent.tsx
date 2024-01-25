import { Box, Button, Typography } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { handleLogout } from '../../Utils/FeedbackUtils';
import { outlinedButton } from '../../Styles/ButtonStyle';
import { colorPalette } from '../../Utils/Constants';

function HttpFailureComponent() {

  const defaultColor = useSelector((state: any) => state.colorReducer);

  const [searchParams, setSearchParams] = useSearchParams();
  const message = searchParams.get("message");
  const code = searchParams.get("code");

  return (
    <Box 
      sx={{backgroundColor: defaultColor?.backgroundColor,textAlign : 'center'}} 
      height={'calc(100vh - 57px)'} 
    >
      <Box paddingTop={'10%'} >
        <Typography variant='h1' fontWeight={800} color={colorPalette.primary} >{code}</Typography>
        <Typography variant='h6' color={'#808080'} >{message}</Typography>
        <Button
              onClick={handleLogout}
              style={{ width: '110px', marginRight: '10px' }}
              sx={outlinedButton}
              variant="text"
            >
              Go Back
            </Button>
      </Box>
    </Box>
  )
}

export default HttpFailureComponent