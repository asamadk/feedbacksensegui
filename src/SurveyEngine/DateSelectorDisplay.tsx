import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function DateSelectorDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const [textColor, setTextColor] = useState('');
  const [position, setPosition] = useState('absolute');
  const [date,setDate] = useState<string>('');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

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
    props.next(date);
  }

  const inputStyleCSS = {
    borderRadius: '10px',
    width: isSmallScreen === true ? '80%' : '55%',
    border: 'none',
    padding: '12px',
    backgroundColor: colors?.shade,
    color: colors?.primaryColor,
    margin: 'auto'
}

  return (
    <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} >
      <Typography fontSize={'28px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
      <input
        type='date'
          value={date}
          style={inputStyleCSS}
          placeholder='Type your answer here...'
          onChange={(e) => setDate(e.target.value)}
        />
      <Box marginTop={'20px'} >
        <Button 
          onClick={next}
          style={{
            width: 'fit-content',
            backgroundColor: colors?.primaryColor,
            color: textColor
          }} 
          variant="contained" 
          >
            {'NEXT'}
          </Button>
      </Box>
    </Box>
  )
}

export default DateSelectorDisplay