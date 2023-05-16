import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useRef } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { settingLayoutStyle, globalSettingSubContainers } from '../Styles/LayoutStyles';
import { getSurveyConfigData, saveSurveyConfig } from '../Utils/Endpoints';
import Notification from '../Utils/Notification';
import { useNavigate, useParams } from 'react-router';
import FSLoader from '../Components/FSLoader';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';

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

  const { surveyId }: any = useParams();

  const snackbarRef: any = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getSurveyConfig();
  }, []);

  const [showStopSurveyNumber, setShowStopSurveyNumber] = React.useState(false);
  const [showStopSurveyDate, setShowStopSurveyDate] = React.useState(false);
  const [showStopSurveyDateData, setShowStopSurveyDateData] = React.useState<string | null>();
  const [showStopSurveyNumberData, setShowStopSurveyNumberData] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);

  const getSurveyConfig = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(getSurveyConfigData(surveyId), { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }

      if (data.data != null) {
        let tempData = data.data;
        if (tempData?.response_limit != null && tempData?.response_limit !== '0') {
          setShowStopSurveyNumber(true);
          setShowStopSurveyNumberData(tempData?.response_limit?.toString());
        }

        if (tempData?.time_limit != null) {
          setShowStopSurveyDate(true)
          const tempTimeLimit = dayjs(tempData?.time_limit).format('MM/DD/YYYY');
          setShowStopSurveyDateData(tempTimeLimit);
        }
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        navigate('/login');
      }
    }

  }

  const handleSaveClick = async () => {
    try {
      let saveObj: any = {};
      const toContinue: boolean = validateSave();
      if (toContinue === false) {
        return;
      }
      if (showStopSurveyNumber === true) {
        saveObj.stopCount = showStopSurveyNumberData;
      }
      if (showStopSurveyDate === true) {
        saveObj.stopTime = showStopSurveyDateData;
      }
      setLoading(true);
      const { data } = await axios.post(
        saveSurveyConfig(surveyId),
        saveObj,
        { withCredentials: true }
      );
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      snackbarRef?.current?.show('Configuration saved.', 'success');
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.statusCode, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        navigate('/login');
      }
    }
  }

  const validateSave = (): boolean => {
    if (showStopSurveyNumber === true && (showStopSurveyNumberData === '0' || showStopSurveyNumberData == null || showStopSurveyNumberData == '')) {
      snackbarRef?.current?.show('Please fill all the details before saving.', 'warning');
      return false;
    }

    if (showStopSurveyDate === true && (showStopSurveyDateData == null || showStopSurveyNumberData == '')) {
      snackbarRef?.current?.show('Please fill all the details before saving.', 'warning');
      return false;
    }

    if (parseInt(showStopSurveyNumberData) > 1000000) {
      snackbarRef?.current?.show('The value entered exceeds the maximum allowed limit. Please enter a valid value.', 'warning');
      return false;
    }

    return true;
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
          <LocalizationProvider size={'small'} dateAdapter={AdapterDayjs}>
            <DatePicker
              sx={{ width: '100%' }}
              value={dayjs(showStopSurveyDateData)}
              onChange={(newVal: any) => setShowStopSurveyDateData(newVal)}
            />
          </LocalizationProvider>
        }
      </Box>
      <Box textAlign={'end'} >
        <Button onClick={handleSaveClick} sx={containedButton} style={{ width: 'fit-content' }} >Save</Button>
      </Box>
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default ConfigureSurvey