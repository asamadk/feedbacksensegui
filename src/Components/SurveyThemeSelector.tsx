import { Box, Typography } from '@mui/material'
import React from 'react'

function SurveyThemeSelector() {
  return (
    <Box sx={{ padding: '20px', overflowY : 'scroll', height : '100%' }}>
      <Box sx={{ textAlign: 'start', marginBottom: '40px' }} >
        <Typography sx={{ color: '#f1f1f1', fontSize: '20px', marginBottom: '10px' }} >Selected theme</Typography>
        <ThemeComponent color={'#4a148c'} />
      </Box>
      <Box sx={{ textAlign: 'start',overflowY : 'scroll',height : '100%' }}  >
        <Typography sx={{ color: '#f1f1f1', fontSize: '20px',marginBottom: '10px' }} >All themes</Typography>
        <ThemeComponent color={'#ffee58'} />
        <ThemeComponent color={'#ff5722'} />
        <ThemeComponent color={'#8bc34a'} />
        <ThemeComponent color={'#009688'} />
        <ThemeComponent color={'#880e4f'} />

      </Box>
    </Box>
  )
}

export default SurveyThemeSelector

function ThemeComponent(props : any) {
  return (
    <Box sx={{cursor : 'pointer', height: '90px', border: '1px #454545 solid', borderRadius: '5px',display : 'flex', marginBottom : '10px' }} >
      <Box sx={{width : '25%',borderRight : '1px #454545 solid', backgroundColor : props.color}} ></Box>
      <Box sx={{width : '75%',margin : 'auto',paddingLeft : '20px'}} >
        <Typography sx={{color : '#f1f1f1'}} >Office vibe</Typography>
        <Typography sx={{color : '#454545'}} >ClassicTheme</Typography>
      </Box>
    </Box>
  );
}