import { Box, Button, Typography } from '@mui/material'
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle'
import { getSurveyDisplayContainerStyle } from '../Styles/SurveyDisplay';
import { getColorsFromTheme } from '../Utils/FeedbackUtils';

function DateSelectorDisplay(props: any) {

  const [colors, setColors] = useState<any>();
  const [textColor, setTextColor] = useState('');
  const [position, setPosition] = useState('absolute');
  const [date,setDate] = useState<Dayjs | null>(null);

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
    props.next(date);
  }

  return (
    <Box sx={getSurveyDisplayContainerStyle(position)} textAlign={'center'} >
      <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
      {/* <DateSelector  /> */}
      <LocalizationProvider size={'small'} dateAdapter={AdapterDayjs}>
        <DatePicker sx={{width : '100%'}} value={date} onChange={(newValue) => setDate(newValue)} />
      </LocalizationProvider>
      <Box marginTop={'20px'} >
        <Button 
          onClick={next}
          style={{
          width: 'fit-content',
          backgroundColor: colors?.secondaryColor,
          color: textColor
        }} sx={containedButton} variant="contained" >{'NEXT'}</Button>
      </Box>
    </Box>
  )
}

export default DateSelectorDisplay

// function DateSelector() {

  

  // return (
  //   <Box marginTop={'20px'} width={'100%'} >
  //     <LocalizationProvider dateAdapter={AdapterDayjs}>
  //       <DateField value={date} onChange={(e) => handleNewValue(e)}  fullWidth={true} size='small' />
  //     </LocalizationProvider>
  //   </Box>
  // )
// }