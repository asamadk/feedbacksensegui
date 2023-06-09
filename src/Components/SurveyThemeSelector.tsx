import { Box, Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import * as Endpoints from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT, getColorSchemes } from '../Utils/Constants';
import Notification from '../Utils/Notification';
import FSLoader from './FSLoader';
import { ColorScheme } from '../Types/GenericTypes';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Utils/FeedbackUtils';


function SurveyThemeSelector(props: any) {

  let navigate = useNavigate();
  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    getSingleSurvey();
  }, []);

  const [selectedTheme, setSelectedTheme] = React.useState<ColorScheme>(getColorSchemes()[0]);

  const getSingleSurvey = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(Endpoints.getSurveyDetails(props.surveyId), { withCredentials: true });
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
      props.updateTheme(design.theme);
      setSelectedTheme(design.theme);
    }
  }

  const handleThemeClick = (colorScheme: ColorScheme) => {
    if (colorScheme.id === selectedTheme.id) {
      return;
    }
    setSelectedTheme(colorScheme);
    props.updateTheme(colorScheme);
    snackbarRef?.current?.show(`${colorScheme.header} selected`, 'success');
    handleSaveClick(colorScheme);
  }

  const handleSaveClick = async (selectedColorTheme : ColorScheme) => {
    try {
      const saveObj = {
        theme: selectedColorTheme
      }
      setLoading(true);
      const { data } = await axios.post(Endpoints.saveSurveyDesgin(props.surveyId), saveObj, { withCredentials: true });
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
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >Selected theme</Typography>
          {/* {
            selectedTheme != null &&
            <Button 
              sx={ButtonStyles.containedButton} style={{width : 'fit-content', color : '#f1f1f1', margin : 0, marginBottom : '15px'}} 
              onClick={handleSaveClick}
            >
              Save
            </Button> 
          } */}
        </Box>
        <ThemeComponent
          color1={selectedTheme?.color[0]}
          color2={selectedTheme?.color[1]}
          textHeading={selectedTheme?.header}
          textSecond={selectedTheme?.text}
        />
      </Box>
      <Box sx={{ textAlign: 'start' }}  >
        <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >All themes</Typography>
        {getColorSchemes().map((colorScheme: ColorScheme) => {
          return (
            <Box key={colorScheme.id} onClick={() => handleThemeClick(colorScheme)} >
              <ThemeComponent
                color1={colorScheme.color[0]}
                color2={colorScheme.color[1]}
                textHeading={colorScheme.header}
                textSecond={colorScheme.text}
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

export default SurveyThemeSelector

function ThemeComponent(props: any) {
  return (
    <Box sx={{ cursor: 'pointer', height: '90px', border: '1px #454545 solid', borderRadius: '5px', display: 'flex', marginBottom: '10px' }} >
      <Box sx={{ width: '25%', borderRight: '1px #454545 solid', backgroundColor: props.color1 }} ></Box>
      <Box sx={{ width: '25%', borderRight: '1px #454545 solid', backgroundColor: props.color2 }} ></Box>
      <Box sx={{ width: '75%', margin: 'auto', paddingLeft: '20px' }} >
        <Typography sx={{ color: '#f1f1f1' }} >{props.textHeading}</Typography>
        <Typography sx={{ color: '#454545' }} >{props.textSecond}</Typography>
      </Box>
    </Box>
  );
}