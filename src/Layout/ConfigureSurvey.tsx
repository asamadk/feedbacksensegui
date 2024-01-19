import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import { styled } from '@mui/system';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { settingLayoutStyle, globalSettingSubContainers } from '../Styles/LayoutStyles';
import { getSurveyConfigData, saveSurveyConfig, updateEmbedConfigAPI } from '../Utils/Endpoints';
import Notification from '../Utils/Notification';
import { useNavigate, useParams } from 'react-router';
import FSLoader from '../Components/FSLoader';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { EmbedPositions, USER_UNAUTH_TEXT, componentName } from '../Utils/Constants';
import { ConfigurePageTabList, handleLogout, validateEmail } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { userRoleType } from '../Utils/types';
import { setSurveyConfigRedux } from '../Redux/Reducers/surveyConfigReducer';
import { useDispatch } from 'react-redux';
import CustomTabSet from '../Components/CustomTabSet';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#006dff',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006dff',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006dff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006dff',
    },
  },
  color: 'white'
});

const embedPositionStyle = {
  border: '1px solid #808080',
  padding: '20px',
  borderRadius: '5px',
  marginTop: '5px',
  width: '20%',
  height: '200px',
  cursor: 'pointer',
  position: 'relative',
}

const selectedEmbedPositionStyle = {
  padding: '20px',
  borderRadius: '5px',
  marginTop: '5px',
  width: '20%',
  height: '200px',
  cursor: 'pointer',
  position: 'relative',
  border: '4px #006dff solid'
}

const getEmbedButtonPosition = (
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | string,
  background : string,
  color : string
) => {
  const obj: any = {
    backgroundColor: background,
    color: color,
    borderRadius: '5px',
    padding: '5px',
    width: 'fit-content',
    fontSize: '13px',
    position: 'absolute',
    transition: 'all 0.5s ease 0s',
    transform: 'translateY(-50%) rotate(90deg)'
  }
  if (position === 'top-left') {
    obj['transform-origin'] = 'left bottom';
    obj.left = '0';
    obj.top = '20%';
  } else if (position === 'top-right') {
    obj['transform-origin'] = 'top right';
    obj.right = '0';
    obj.top = '60%';
  } else if (position === 'bottom-left') {
    obj['transform-origin'] = 'left bottom';
    obj.left = '0';
    obj.top = '50%';
  } else if (position === 'bottom-right') {
    obj['transform-origin'] = 'top right';
    obj.right = '0';
    obj.top = '90%';
  }
  return obj;
}

function ConfigureSurvey() {

  const { surveyId }: any = useParams();
  const snackbarRef: any = useRef(null);
  const dispatch = useDispatch();

  const defaultColor = useSelector((state: any) => state.colorReducer);
  let initialized = false;

  useEffect(() => {
    if (initialized === false) {
      getSurveyConfig();
      initialized = true;
    }
  }, []);

  const [notifyUser, setNotifyUser] = React.useState(false);
  const [emailList, setEmailList] = React.useState('');
  const [showStopSurveyNumber, setShowStopSurveyNumber] = React.useState(true);
  const [showStopSurveyDate, setShowStopSurveyDate] = React.useState(false);
  const [showStopSurveyDateData, setShowStopSurveyDateData] = React.useState<string | null>('');
  const [showStopSurveyNumberData, setShowStopSurveyNumberData] = React.useState<string>('');
  const [embedPositionList, setEmbedPositionList] = useState(EmbedPositions);
  const [loading, setLoading] = React.useState(false);
  const [selectedColor, setSelectedColor] = useState('#006dff');
  const [selectedTextColor, setSelectedTextColor] = useState('#ffffff');
  const [value, setValue] = React.useState(0);
  const [selectedPosition, setSelectedPosition] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top-left');

  const userRole: userRoleType = useSelector((state: any) => state.userRole);
  const surveyConfigState = useSelector((state: any) => state.surveyConfig);

  const getSurveyConfig = async () => {
    try {
      if (surveyConfigState == null || surveyConfigState?.survey_id !== surveyId) {
        setLoading(true);
        const { data } = await axios.get(getSurveyConfigData(surveyId), { withCredentials: true });
        setLoading(false);
        if (data.statusCode !== 200) {
          snackbarRef?.current?.show(data?.message, 'error');
          return;
        }

        if (data.data != null) {
          dispatch(setSurveyConfigRedux(data.data));
          populateSurveyConfig(data.data);
        }
      } else {
        populateSurveyConfig(surveyConfigState);
      }
    } catch (error: any) {
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const populateSurveyConfig = (tempData: any) => {
    console.log("🚀 ~ file: ConfigureSurvey.tsx:150 ~ populateSurveyConfig ~ tempData:", tempData)
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

    if(tempData?.widget_position != null){
      setSelectedPosition(tempData.widget_position);
      const tmp = JSON.parse(JSON.stringify(embedPositionList));
      tmp.forEach((t: any) => {
        if (t.name === tempData.widget_position) {
          t.selected = true;
        } else {
          t.selected = false;
        }
      });
      setEmbedPositionList(tmp);
    }

    if(tempData?.button_color != null){
      setSelectedColor(tempData.button_color);
    }

    if(tempData?.button_text_color != null){
      setSelectedTextColor(tempData.button_text_color);
    }

  }

  const handleSaveClick = async () => {
    if (!CoreUtils.isComponentVisible(userRole, componentName.SAVE_SURVEY_BUTTON)) {
      snackbarRef?.current?.show('Guest cannot edit the surveys', 'error');
      return;
    }
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
      dispatch(setSurveyConfigRedux(data.data));
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

  const handleTabChange = (newValue: number) => {
    setValue(newValue);
  };

  const GeneralTab = () => {
    return (
      <>
        {
          value === 0 &&
          <>
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
          </>
        }
      </>
    )
  }

  const handlePositionChangeClick = (id: number) => {
    const tmp = JSON.parse(JSON.stringify(embedPositionList));
    tmp.forEach((t: any) => {
      if (t.id === id) {
        setSelectedPosition(t.name);
        t.selected = true;
      } else {
        t.selected = false;
      }
    });
    setEmbedPositionList(tmp);
  }

  const handleWidgetButtonColorChange = (e: any) => {
    const colorVal = e.target.value;
    setSelectedColor(colorVal);
  }

  const handleWidgetButtonTextColorChange = (e: any) => {
    const colorVal = e.target.value;
    setSelectedTextColor(colorVal);
  }

  const handleEmbedSettingSave = async () => {
    try {
      const URL = updateEmbedConfigAPI();
      const saveObj = {
        position : selectedPosition,
        buttonColor : selectedColor,
        textColor : selectedTextColor,
        surveyId : surveyId
      }
      setLoading(true);
      const {data} = await axios.post(URL,saveObj,{withCredentials : true});
      setLoading(false);
      dispatch(setSurveyConfigRedux(data.data));
      snackbarRef?.current?.show(data?.message, 'success');
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const EmbedTab = () => {
    return (
      <>
        {
          value === 1 && <>
            <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
              <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Widget Position</Typography>
              <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
                Select where would you like to display the Feedback button
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                {embedPositionList.map(embed =>
                  <Box
                    onClick={() => handlePositionChangeClick(embed.id)}
                    className="current"
                    sx={embed.selected ? selectedEmbedPositionStyle : embedPositionStyle}
                  >
                    <Box sx={getEmbedButtonPosition(embed.name,selectedColor,selectedTextColor)} >Feedback</Box>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
              <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Button Color</Typography>
              <Box sx={{ display: 'flex' }} >
                <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
                  Select the color of Feedback button
                </Typography>
                <Box marginTop={'20px'} marginLeft={'10px'}>
                  <input onChange={handleWidgetButtonColorChange} type='color' value={selectedColor} />
                </Box>
              </Box>
            </Box>
            <Box sx={globalSettingSubContainers(defaultColor?.primaryColor)} >
              <Typography fontSize={'18px'} width={200} textAlign={'start'} color={'#f1f1f1'} >Text Color</Typography>
              <Box sx={{ display: 'flex' }} >
                <Typography marginTop={'20px'} textAlign={'start'} color={'#808080'} >
                  Select the color of Feedback button's text
                </Typography>
                <Box marginTop={'20px'} marginLeft={'10px'}>
                  <input onChange={handleWidgetButtonTextColorChange} type='color' value={selectedTextColor} />
                </Box>
              </Box>
            </Box>
            <Box textAlign={'end'} >
              <Button onClick={handleEmbedSettingSave} sx={containedButton} style={{ width: 'fit-content' }} >Save</Button>
            </Box>
          </>
        }
      </>
    )
  }

  return (
    <Box sx={{ ...settingLayoutStyle, backgroundColor: defaultColor?.backgroundColor }} >
      <CustomTabSet
        tabsetList={ConfigurePageTabList}
        change={(value: number) => handleTabChange(value)}
        index={value}
      ></CustomTabSet>
      {GeneralTab()}
      {EmbedTab()}
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default ConfigureSurvey