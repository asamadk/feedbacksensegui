import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { containedButton } from '../Styles/ButtonStyle';

function WelcomeDisplay(props: any) {
  return (
    <Box textAlign={'center'} margin={'15px'} padding={'15px'} marginTop={'40%'}>
      <Typography fontSize={'26px'} color={'#29292a'} fontWeight={300} >{props?.data?.welcomeText}</Typography>
      <Box marginTop={'20px'} >
        <Button style={{ width: 'fit-content' }} sx={containedButton} variant="contained" >{props?.data?.buttonText?.toUpperCase()}</Button>
      </Box>
    </Box>
  )
}

export default WelcomeDisplay