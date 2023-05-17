import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function WelcomeDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const [textColor, setTextColor] = useState('');
  const [position, setPosition] = useState('absolute');

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
    props.next({
      click : 'next'
    });
  }

  return (
    <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} >
      <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.welcomeText}</Typography>
      <Box marginTop={'20px'} >
        <Button
          onClick={next}
          style={{
            width: 'fit-content',
            backgroundColor: colors?.secondaryColor,
            color: textColor
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