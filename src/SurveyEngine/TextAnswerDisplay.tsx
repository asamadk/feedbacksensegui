import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { TEMPLATE_KEY } from '../Utils/Constants';

function TextAnswerDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  const [textColor, setTextColor] = useState('');
  const [position, setPosition] = useState('absolute');
  const [textAnswerValue, setTextAnswerValue] = useState('');

  useEffect(() => {
    if (props.theme != null) {
      processThemeData();
    }
    verifyLiveSurvey();

    // Add event listener for "Enter" key press
    document.addEventListener('keydown', handleKeyPress);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
  }, [props]);


  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && event.shiftKey) {
      next();
    }
  };

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
      answer: textAnswerValue
    }
    props.next(res);
  }

  const inputStyleCSS = {
    borderRadius: '10px',
    width: isSmallScreen === true ? '80%' : '65%',
    border: 'none',
    padding: '20px',
    backgroundColor: colors?.shade,
    color: colors?.primaryColor,
    paddingBottom: '40px',
    margin: 'auto'
  }

  return (
    <Box sx={getSurveyDisplayContainerStyle(position,props.surveyId === TEMPLATE_KEY)} textAlign={'center'} >
      <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center',overflowWrap : 'break-word' }} >
        <Box marginTop={'20px'} sx={{ overflowY: 'scroll' }} >
          <Typography fontSize={'26px'} color={colors?.primaryColor} fontWeight={200} >{props?.data?.question}</Typography>
          <Box marginTop={'20px'} >
            <textarea
              style={inputStyleCSS}
              value={textAnswerValue}
              placeholder='Type your answer here...'
              onChange={(e) => setTextAnswerValue(e.target.value)}
            />
            <Typography color={colors?.primaryColor} >Press <b>Enter</b> for new line</Typography>
          </Box>
          <Button
            onClick={next}
            style={{
              width: 'fit-content',
              margin: 'auto',
              marginTop: '20px',
              backgroundColor: colors?.primaryColor,
              color: textColor
            }} variant="contained" >{'NEXT'}
          </Button>
        <Typography marginTop={'20px'} color={colors?.primaryColor} >Press <b>Shift + Enter</b> to submit</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default TextAnswerDisplay