import { Box, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React from 'react'


function OrgGeneralSettings() {
  return (
    <Box sx={LayoutStyles.globalSettingSubContainers} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Name </Typography>
        <Typography color={'#454545'} >Alif Clothing</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Owner </Typography>
        <Typography color={'#454545'} >Abdul Samad Kirmani</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Name </Typography>
        <Typography color={'#454545'} >a.samadk</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Email </Typography>
        <Typography color={'#454545'} >abdul.samadkirmani.samad63@gmail.com</Typography>
      </Box>
    </Box>
  )
}

export default OrgGeneralSettings