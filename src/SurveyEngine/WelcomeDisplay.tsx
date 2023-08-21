import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getCenterAlignmentStyle, getColorsFromTheme } from '../Utils/FeedbackUtils';
import { TEMPLATE_KEY } from '../Utils/Constants';

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
      click: 'next'
    });
  }

  return (
    <Box sx={getSurveyDisplayContainerStyle(position,props.surveyId === TEMPLATE_KEY)} textAlign={'center'} >
      <Box height={'90vh'} sx={{ ...getCenterAlignmentStyle(), overflowY: 'scroll', textAlign: 'center', overflowWrap: 'break-word' }} >
        <Box marginTop={'20px'} sx={{ overflowY: 'scroll' }} >
          <Typography fontSize={'26px'} color={colors?.primaryColor} fontWeight={300} >{props?.data?.welcomeText}</Typography>
          <Button
            onClick={next}
            sx={{
              "&.MuiButtonBase-root:hover": {
                bgcolor: colors?.shade
              },
              backgroundColor: colors?.primaryColor,
              color: textColor,
            }}
            variant="contained" >
            {props?.data?.buttonText?.toUpperCase()}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default WelcomeDisplay