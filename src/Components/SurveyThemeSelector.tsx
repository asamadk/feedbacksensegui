import { Box, Button, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import * as ButtonStyles from '../Styles/ButtonStyle'
import { getColorSchemes } from '../Utils/Constants';
import Notification from '../Utils/Notification';
import FSLoader from './FSLoader';
import PoweredBy from './PoweredBy';


function SurveyThemeSelector(props : any) {

  const snackbarRef :any = useRef(null);
  const [ loading , setLoading] = React.useState(false);

  useEffect(() => {
    getSingleSurvey();
  },[]);

  const [selectedTheme, setSelectedTheme] = React.useState<any>(getColorSchemes()[0]);

  const getSingleSurvey = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(Endpoints.getSurveyDetails(props.surveyId),{ withCredentials : true });
      setLoading(false);
      
      if(data?.statusCode !== 200){
        snackbarRef?.current?.show(data?.message, 'error');
      }

      if (data != null) {
        const tempSurvey = data.data;
        populateSurveyDesign(tempSurvey);
        
      }
    } catch (error : any ) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
    }
  }

  const populateSurveyDesign = (tempSurvey : any) => {
    if(tempSurvey != null){
      const surveyDesign = tempSurvey.survey_design_json;
      if(surveyDesign == null){
        return;
      }
      const design = JSON.parse(surveyDesign);
      props.updateTheme(design.theme);
      setSelectedTheme(design.theme);
    }
  }

  const handleThemeClick = (colorScheme : any) => {    
    setSelectedTheme(colorScheme);
    props.updateTheme(colorScheme);
    snackbarRef?.current?.show(`${colorScheme.header} selected`,'success');
  }

  const handleSaveClick = async () => {
    try {
      const saveObj = {
        theme : selectedTheme
      }
      setLoading(true);
      const { data } = await axios.post(Endpoints.saveSurveyDesgin(props.surveyId),saveObj,{ withCredentials : true });
      setLoading(false);
      if(data.statusCode !== 200){
        snackbarRef?.current?.show(data.message,'error');
        return;
      }
      snackbarRef?.current?.show('Design saved.','success'); 
    } catch (error : any ) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
    }

  }

  return (
    <Box sx={{ padding: '20px', overflowY: 'scroll', height: 'calc(100vh - 200px)' }}>
      <Box sx={{ textAlign: 'start', marginBottom: '40px' }} >
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >Selected theme</Typography>
          {
            selectedTheme != null &&
            <Button 
              sx={ButtonStyles.containedButton} style={{width : 'fit-content', color : '#f1f1f1', margin : 0, marginBottom : '15px'}} 
              onClick={handleSaveClick}
            >
              Save
            </Button> 
          }
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
        {getColorSchemes().map(colorScheme => {
          return (
            <Box key={colorScheme.id}  onClick={() => handleThemeClick(colorScheme)} >
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
      <Notification ref={snackbarRef}/>
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