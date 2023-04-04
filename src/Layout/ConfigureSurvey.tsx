import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import { settingLayoutStyle, globalSettingSubContainers } from '../Styles/LayoutStyles';
import { getSurveyConfigData, saveSurveyConfig } from '../Utils/Endpoints';
import { getSurveyIdFromLocalStorage } from '../Utils/FeedbackUtils';
import Notification from '../Utils/Notification';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FFA500',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFA500',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  color: 'white'
});

function ConfigureSurvey() {

  const snackbarRef :any = useRef(null);

  useEffect(() => {
    getSurveyConfig();
  },[]);

  const [showStopSurveyNumber, setShowStopSurveyNumber] = React.useState(false);
  const [showStopSurveyDate, setShowStopSurveyDate] = React.useState(false);
  const [showStopSurveyDateData, setShowStopSurveyDateData] = React.useState<string>();
  const [showStopSurveyNumberData, setShowStopSurveyNumberData] = React.useState<string>();

  const getSurveyConfig = async() => {
    let surveyId = getSurveyIdFromLocalStorage();
    const { data } = await axios.get(getSurveyConfigData(surveyId));
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
        return;
    }

    if(data.data != null){
      let tempData = data.data;
      if(tempData?.response_limit != null && tempData?.response_limit != '0'){
        setShowStopSurveyNumber(true);
        setShowStopSurveyNumberData(tempData?.response_limit?.toString());
      }

      if(tempData?.time_limit != null){
        setShowStopSurveyDate(true)
        setShowStopSurveyDateData(tempData?.time_limit);
      }
    }

  }

  const handleSaveClick = async() => {
    let saveObj : any = {};
    if(showStopSurveyNumber === true){
      saveObj.stopCount = showStopSurveyNumberData;
    }

    if(showStopSurveyDate === true){
      saveObj.stopTime = showStopSurveyDateData;
    }

    const { data } = await axios.post(
      saveSurveyConfig(getSurveyIdFromLocalStorage()),
      saveObj
    );

    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
        return;
    }

    snackbarRef?.current?.show('Configuration saved.','success');
  }

  return (
    <Box sx={settingLayoutStyle} overflow={'scroll'} >

      <Box sx={globalSettingSubContainers} >
        <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Responses limit</Typography>
        <Typography marginTop={'20px'} textAlign={'start'} color={'#454545'} >
          Set the maximum number of responses you'd like to collect with this survey.
        </Typography>
        <Box textAlign={'start'} >
          <FormControlLabel
            sx={{ color: 'whitesmoke' }}
            control={<Switch onChange={(e) => setShowStopSurveyNumber(e.target.checked)} checked={showStopSurveyNumber} value={showStopSurveyNumber} color="warning" />}
            label="Stop the survey after collecting a specific number of responses"
          />
        </Box>
        {showStopSurveyNumber === true &&
          <CssTextField
            size='small'
            type={'number'}
            sx={{ input: { color: 'white' } }}
            id="outlined-basic"
            placeholder='Enter a number'
            variant="outlined"
            style={{ width: '100%', }}
            value={showStopSurveyNumberData}
            onChange={(e) => setShowStopSurveyNumberData(e.target.value)}
          />
        }
      </Box>

      <Box sx={globalSettingSubContainers} >
        <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >End date</Typography>
        <Typography marginTop={'20px'} textAlign={'start'} color={'#454545'} >
          Set a cut-off date on which this survey will close and stop accepting responses.
        </Typography>
        <Box textAlign={'start'} >
          <FormControlLabel
            sx={{ color: 'whitesmoke' }}
            control={<Switch onChange={(e) => setShowStopSurveyDate(e.target.checked)} checked={showStopSurveyDate} value={showStopSurveyDate} color="warning" />}
            label="Stop the survey on a specific date."
          />
        </Box>
        {showStopSurveyDate === true &&
          <CssTextField
            size='small'
            type={'date'}
            sx={{ input: { color: 'white' } }}
            id="outlined-basic"
            placeholder='Enter a number'
            variant="outlined"
            style={{ width: '100%', }}
            value={showStopSurveyDateData}
            onChange={(e) => setShowStopSurveyDateData(e.target.value)}
          />
        }
      </Box>
      <Box textAlign={'end'} >
        <Button onClick={handleSaveClick} sx={containedButton} style={{width : 'fit-content'}} >Save</Button>
      </Box>
      <Notification ref={snackbarRef}/>
    </Box>
  )
}

export default ConfigureSurvey