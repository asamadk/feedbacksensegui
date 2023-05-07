import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function TextAnswerDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const [textColor, setTextColor] = useState('');
  const [position, setPosition] = useState('absolute');
  const [textAnswerValue, setTextAnswerValue] = useState('');

  useEffect(() => {
    if (props.theme != null) {
      processThemeData();
    }
    verifyLiveSurvey();
  }, [props]);

  const verifyLiveSurvey = () => {
    if (props.surveyId) {
      setPosition('absolute');
    } else {
      setPosition('relative')
    }
  }

  const processThemeData = () => {
    const currentTheme = props.theme;
    setColors(getColorsFromTheme(currentTheme));
    setTextColor(currentTheme.textColor);
  }

  const next = () => {
    const res = {
      answer : textAnswerValue
    }
    props.next(res);
  }

  return (
    <Box sx={getSurveyDisplayContainerStyle(position)}  textAlign={'center'} >
      <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
      <Box marginTop={'20px'} >
        <TextField 
          value={textAnswerValue} 
          sx={{ width: '100%' }} 
          id="outlined-basic" 
          label="Give your answer" 
          size='small' 
          variant="outlined"
          onChange={(e) => setTextAnswerValue(e.target.value)}
        />
      </Box>
      <Button
        onClick={next}
        style={{
        width: 'fit-content',
        marginRight: '15px',
        backgroundColor: colors?.secondaryColor,
        color: textColor
      }} sx={containedButton} variant="contained" >{'NEXT'}</Button>
    </Box>
  )
}

export default TextAnswerDisplay