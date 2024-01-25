import { Box, Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import * as Endpoints from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT, colorPalette, componentName, getColorSchemes } from '../Utils/Constants';
import Notification from '../Utils/Notification';
import FSLoader from './FSLoader';
import { ColorScheme } from '../Types/GenericTypes';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { userRoleType } from '../Utils/types';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { useDispatch } from 'react-redux';
import { setSurvey } from '../Redux/Reducers/surveyReducer';


function SurveyThemeSelector(props: any) {

  let navigate = useNavigate();
  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const userRole: userRoleType = useSelector((state: any) => state.userRole);
  const surveysState = useSelector((state: any) => state.surveys);

  let initialized = false;

  useEffect(() => {
    if (initialized === false) {
      getSingleSurvey();
      initialized = true;
    }

  }, []);

  const [selectedTheme, setSelectedTheme] = React.useState<ColorScheme>(getColorSchemes()[0]);

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
      props.updateTheme(design.theme);
      props.updateBackground(design?.background)
      setSelectedTheme(design.theme);
    }
  }

  const handleThemeClick = (colorScheme: ColorScheme) => {
    if (!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)) {
      snackbarRef?.current?.show('Guest cannot edit the surveys', 'error');
      return;
    }
    if (colorScheme.id === selectedTheme.id) {
      return;
    }
    setSelectedTheme(colorScheme);
    props.updateTheme(colorScheme);
    snackbarRef?.current?.show(`${colorScheme.header} selected`, 'success');
    handleSaveClick(colorScheme);
  }

  const handleSaveClick = async (selectedColorTheme: ColorScheme) => {
    try {
      const saveObj = {
        theme: selectedColorTheme,
        background: props?.selectedBackground
      }
      setLoading(true);
      const { data } = await axios.post(Endpoints.saveSurveyDesgin(props.surveyId), saveObj, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data.message, 'error');
        return;
      }
      props.updateThemeReduxState(JSON.stringify(saveObj));
      snackbarRef?.current?.show('Design saved.', 'success');
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }

  }

  return (
    <Box sx={{ padding: '20px', overflowY: 'scroll', height: 'calc(100vh - 200px)' }}>
      <Box sx={{ textAlign: 'start' }}  >
        <Typography sx={{ color: colorPalette.darkBackground, fontSize: '20px', marginBottom: '10px' }} >All themes</Typography>
        <Box display={'flex'} sx={{ flexWrap: 'wrap' }}>
          {getColorSchemes().map((colorScheme: ColorScheme) => {
            return (
              <Box sx={{ width: '25%' }} key={colorScheme.id} onClick={() => handleThemeClick(colorScheme)} >
                <ThemeComponent
                  selected={colorScheme.id === selectedTheme.id}
                  color1={colorScheme.color[0]}
                  color2={colorScheme.color[1]}
                  textHeading={colorScheme.header}
                  textSecond={colorScheme.text}
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

export default SurveyThemeSelector

const themeStyleCss = {
  cursor: 'pointer',
  height: '90px',
  borderRadius: '6px',
  display: 'flex',
  marginBottom: '10px',
  marginRight: '5px'
}

const selectedThemeStyleCss = {
  cursor: 'pointer',
  height: '85px',
  border: `2px black solid`,
  borderRadius: '6px',
  display: 'flex',
  marginBottom: '10px',
  marginRight: '5px',
}

function ThemeComponent(props: any) {

  return (
    <Box sx={props.selected ? selectedThemeStyleCss : themeStyleCss} >
      <Box sx={{ width: '100%',  backgroundColor: props.color1,borderRadius : '5px' }} ></Box>
    </Box>
  );
}