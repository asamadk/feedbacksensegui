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
import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout, validateEmail } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#006DFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006DFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006DFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006DFF',
    },
  },
  color: 'white'
});

function ConfigureSurvey() {

  const { surveyId }: any = useParams();

  const snackbarRef: any = useRef(null);
  const navigate = useNavigate();
  const defaultColor = useSelector((state: any) => state.colorReducer);

  useEffect(() => {
    getSurveyConfig();
  }, []);

  const [notifyUser, setNotifyUser] = React.useState(false);
  const [emailList, setEmailList] = React.useState('');
  const [showStopSurveyNumber, setShowStopSurveyNumber] = React.useState(true);
  const [showStopSurveyDate, setShowStopSurveyDate] = React.useState(false);
  const [showStopSurveyDateData, setShowStopSurveyDateData] = React.useState<string | null>('');
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
        if (tempData?.response_limit != null && tempData?.response_limit !== 0) {
          setShowStopSurveyNumber(true);
          setShowStopSurveyNumberData(tempData?.response_limit?.toString());
        }

        if (tempData?.time_limit != null) {
          setShowStopSurveyDate(true)
          const tempTimeLimit = dayjs(tempData?.time_limit).format('MM/DD/YYYY');
          setShowStopSurveyDateData(tempTimeLimit);
        }

        if (tempData?.emails != null) {
          setNotifyUser(true);
          setEmailList(tempData?.emails);
        }
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
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
      if (notifyUser === true) {
        saveObj.emails = emailList;
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
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const validateSave = (): boolean => {
    if (showStopSurveyNumber === true && (showStopSurveyNumberData === '0' || showStopSurveyNumberData == null || showStopSurveyNumberData == '')) {
      snackbarRef?.current?.show('Please fill all the details before saving.', 'warning');
      return false;
    }

    const isDateValid = dayjs(showStopSurveyDateData).isValid();
    if (showStopSurveyDate === true) {
      if (isDateValid === false) {
        snackbarRef?.current?.show('Selected date is not valid.', 'warning');
        return false;
      }
      if (showStopSurveyDateData == null) {
        snackbarRef?.current?.show('Please fill all the details before saving.', 'warning');
        return false;
      }
      const currentDate = dayjs();
      const selectedDate = dayjs(showStopSurveyDateData);
      const isPast = selectedDate.isBefore(currentDate);

      if (isPast === true) {
        snackbarRef?.current?.show('Selected date is in the past. Please choose a future date.', 'warning');
        return false;
      }
    }

    if (parseInt(showStopSurveyNumberData) > 1000000) {
      snackbarRef?.current?.show('The value entered exceeds the maximum allowed limit. Please enter a valid value.', 'warning');
      return false;
    }

    if (notifyUser === true && (emailList == null || emailList.length < 1)) {
      snackbarRef?.current?.show('Please fill all the details before saving.', 'warning');
      return false;
    }

    if (notifyUser === true) {
      const emails = emailList.split(',');
      for (const email of emails) {
        if (validateEmail(email.trim()) == null) {
          snackbarRef?.current?.show('Please give valid email.', 'warning');
          return false;
        }
      }
    }

    return true;
  }

  return (
    <Box sx={{...settingLayoutStyle,backgroundColor : defaultColor?.backgroundColor}} >

      <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
        <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Response notification</Typography>
        <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
          Would you like to receive notifications when someone fills out the survey?
        </Typography>
        <Box textAlign={'start'} >
          <FormControlLabel
            sx={{ color: 'whitesmoke' }}
            control={<Switch onChange={(e) => setNotifyUser(e.target.checked)} checked={notifyUser} value={notifyUser} color="info" />}
            label="Notify me"
          />
        </Box>
        {
          notifyUser &&
          <CssTextField
            size='small'
            sx={{ input: { color: 'white' } }}
            id="outlined-basic"
            placeholder='Please enter the emails separated by commas.'
            variant="outlined"
            style={{ width: '100%', }}
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
          />
        }
      </Box>

      <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
        <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Responses limit</Typography>
        <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
          Set the maximum number of responses you'd like to collect with this survey.
        </Typography>
        {/* <Box textAlign={'start'} >
          <FormControlLabel
            sx={{ color: 'whitesmoke' }}
            control={<Switch onChange={(e) => setShowStopSurveyNumber(e.target.checked)} checked={showStopSurveyNumber} value={showStopSurveyNumber} color="info" />}
            label="Stop the survey after collecting a specific number of responses"
          />
        </Box> */}
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

      <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
        <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >End date</Typography>
        <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
          Set a cut-off date on which this survey will close and stop accepting responses.
        </Typography>
        <Box textAlign={'start'} >
          <FormControlLabel
            sx={{ color: 'whitesmoke' }}
            control={<Switch onChange={(e) => setShowStopSurveyDate(e.target.checked)} checked={showStopSurveyDate} value={showStopSurveyDate} color="info" />}
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