import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function WelcomeDisplay(props: any) {

  const [colors , setColors] = useState<any>();
  const [textColor , setTextColor ] = useState('');

  useEffect(() => {
    if(props.theme != null){
      processThemeData();
    }
  },[props]);
  
  const processThemeData = () => {
    const currentTheme = props.theme;
    setColors(getColorsFromTheme(currentTheme));
    setTextColor(currentTheme.textColor);
  }

  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'40%'}>
      <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.welcomeText}</Typography>
      <Box marginTop={'20px'} >
        <Button 
          style={{
            width : 'fit-content', 
            backgroundColor:colors?.secondaryColor,
            color : textColor
          }} 
          sx={containedButton} 
          variant="contained" >
            {props?.data?.buttonText?.toUpperCase()}
        </Button>
      </Box>
    </Box>
  )
}

export default WelcomeDisplay