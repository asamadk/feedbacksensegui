import { Box, Button, FormControlLabel, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import Notification from '../Utils/Notification';
import FSLoader from './FSLoader';
import { USER_UNAUTH_TEXT, getBackgrounds } from '../Utils/Constants';
import axios from 'axios';
import { getSurveyDetails, saveSurveyDesgin } from '../Utils/Endpoints';
import { handleLogout } from '../Utils/FeedbackUtils';

function BackgroundTemplates(props: any) {

  useEffect(() => {
    getSingleSurvey();
  }, []);

  const [selectedBackground, setSelectedBackground] = React.useState<any>(getBackgrounds()[0]);
  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);

  const getSingleSurvey = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(getSurveyDetails(props.surveyId), { withCredentials: true });
      setLoading(false);

      if (data?.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
      }

      if (data != null) {
        const tempSurvey = data.data;
        populateSurveyDesign(tempSurvey);

      }
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
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

  const handleSaveClick = async (background : any) => {
    try {
      const selectedTheme = props.selectedTheme;
      console.log("🚀 ~ file: BackgroundTemplates.tsx:26 ~ handleSaveClick ~ selectedTheme:", selectedTheme)
      const saveObj = {
        theme: selectedTheme,
        background : background
      }
      setLoading(true);
      const { data } = await axios.post(saveSurveyDesgin(props.surveyId), saveObj, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data.message, 'error');
        return;
      }
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
      <Box sx={{ textAlign: 'start', marginBottom: '40px' }} >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >Selected background</Typography>
        </Box>
        <BackgroundComponent background={selectedBackground} />
      </Box>
      <Box sx={{ textAlign: 'start' }}  >
        <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >All backgrounds</Typography>
        {getBackgrounds().map((background) => {
          return (
            <Box key={background.id} onClick={() => handleBackgroundClick(background)}>
              <BackgroundComponent
                background={background}
              />
            </Box>
          )
        })}
      </Box>
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default BackgroundTemplates

function BackgroundComponent({ background }: any) {
  return (
    <Box sx={{ cursor: 'pointer', height: '90px', border: '1px #454545 solid', borderRadius: '5px', display: 'flex', marginBottom: '10px' }} >
      <Box className={background?.value} sx={{ width: '25%', borderRight: '1px #454545 solid', backgroundColor: '#ffffff' }} ></Box>
      <Box sx={{ width: '75%', margin: 'auto', paddingLeft: '20px' }} >
        <Typography sx={{ color: '#f1f1f1' }} >{background?.name}</Typography>
      </Box>
    </Box>
  );
}