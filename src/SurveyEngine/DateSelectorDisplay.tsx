import { Box, Button, Typography } from '@mui/material'
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import React from 'react'
import { containedButton } from '../Styles/ButtonStyle'

function DateSelectorDisplay(props : any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'20%'} >
        <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
        <DateSelector/>
        <Box marginTop={'20px'} >
        <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" >{'NEXT'}</Button>
      </Box>
    </Box>
  )
}

export default DateSelectorDisplay

function DateSelector(){
    return(
        <Box marginTop={'20px'} width={'100%'} >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField fullWidth={true} size='small'/>
            </LocalizationProvider>
        </Box>
    )
}