import { Box, Button, FormControlLabel, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import Notification from '../Utils/Notification';
import FSLoader from './FSLoader';
import { USER_UNAUTH_TEXT, colorPalette, getBackgrounds } from '../Utils/Constants';
import axios from 'axios';
import { getSurveyDetails, saveSurveyDesgin } from '../Utils/Endpoints';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';


function BackgroundTemplates(props: any) {

  let initialized = false;
  const surveysState = useSelector((state: any) => state.surveys);

  useEffect(() => {
    if (initialized === false) {
      getSingleSurvey();
      initialized = true;
    }
  }, []);

  const [selectedBackground, setSelectedBackground] = React.useState<any>(getBackgrounds()[0]);
  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);

  const getSingleSurvey = async () => {
    surveysState?.forEach((srv: any) => {
      if (srv.id === props.surveyId) {
        populateSurveyDesign(srv);
        return;
      }
    });
  }

  const populateSurveyDesign = (tempSurvey: any) => {
    if (tempSurvey != null) {
      const surveyDesign = tempSurvey.survey_design_json;
      if (surveyDesign == null) {
        return;
      }
      const design = JSON.parse(surveyDesign);
      // props.updateTheme(design.background);
      setSelectedBackground(design.background);
    }
  }

  const handleBackgroundClick = (background: any) => {
    if (background.id === selectedBackground.id) {
      return;
    }
    setSelectedBackground(background);
    props.updateTheme(background);
    snackbarRef?.current?.show(`${background?.name} selected`, 'success');
    handleSaveClick(background);
  }

  const handleSaveClick = async (background: any) => {
    try {
      const selectedTheme = props.selectedTheme;
      const saveObj = {
        theme: selectedTheme,
        background: background
      }
      setLoading(true);
      const { data } = await axios.post(saveSurveyDesgin(props.surveyId), saveObj, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data.message, 'error');
        return;
      }
      props.updateThemeReduxState(JSON.stringify(saveObj));
      snackbarRef?.current?.show('Design saved.', 'success');
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  return (
    <Box sx={{ padding: '20px', overflowY: 'scroll', height: 'calc(100vh - 200px)' }}>
      <Box sx={{ textAlign: 'start' }}  >
        <Typography sx={{ color: colorPalette.darkBackground, fontSize: '20px', marginBottom: '10px' }} >All backgrounds</Typography>
        <Box display={'flex'} sx={{ flexWrap: 'wrap' }}>
          {getBackgrounds().map((background) => {
            return (
              <Box sx={{ width: '25%' }} key={background.id} onClick={() => handleBackgroundClick(background)}>
                <BackgroundComponent
                  background={background}
                  selected={selectedBackground.id === background.id}
                />
              </Box>
            )
          })}
        </Box>
      </Box>
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default BackgroundTemplates

const backComponentStyle = {
  cursor: 'pointer',
  height: '90px',
  // border: '1px #454545 solid',
  borderRadius: '6px',
  display: 'flex',
  marginBottom: '10px',
  marginRight: '5px'
};

const selectedBackComponentStyle = {
  cursor: 'pointer',
  height: '85px',
  border: `2px ${colorPalette.darkBackground} solid`,
  borderRadius: '6px',
  display: 'flex',
  marginBottom: '10px',
  marginRight: '5px'
};

function BackgroundComponent({ background, selected }: any) {
  return (
    <Box sx={selected ? selectedBackComponentStyle : backComponentStyle} >
      <Box
        className={background?.value}
        sx={{ backgroundColor: background?.value || '#ffffff', width: '100%',borderRadius : '6px' }}
      ></Box>
    </Box>
  );
}