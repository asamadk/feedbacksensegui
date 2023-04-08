import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';

function TextAnswerDisplay(props : any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'40%'} >
      <Typography fontSize={'28px'} color={'#29292a'} fontWeight={200} >{props?.data?.question}</Typography>
      <Box marginTop={'20px'} >
        <TextField sx={{width : '100%'}} id="outlined-basic" label="Give your answer" size='small' variant="outlined" />
      </Box>
      <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" >{'NEXT'}</Button>
    </Box>
  )
}

export default TextAnswerDisplay