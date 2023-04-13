import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function TextAnswerDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const [textColor, setTextColor] = useState('');

  useEffect(() => {
    if (props.theme != null) {
      processThemeData();
    }
  }, [props]);

  const processThemeData = () => {
    const currentTheme = props.theme;
    setColors(getColorsFromTheme(currentTheme));
    setTextColor(currentTheme.textColor);
  }

  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'40%'} >
      <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
      <Box marginTop={'20px'} >
        <TextField sx={{ width: '100%' }} id="outlined-basic" label="Give your answer" size='small' variant="outlined" />
      </Box>
      <Button style={{
        width: 'fit-content',
        marginRight: '15px',
        backgroundColor: colors?.secondaryColor,
        color: textColor
      }} sx={containedButton} variant="contained" >{'NEXT'}</Button>
    </Box>
  )
}

export default TextAnswerDisplay