import { Box, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React, { useRef } from 'react'
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useSelector } from 'react-redux';
import { colorPalette } from '../Utils/Constants';


function OrgGeneralSettings() {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const currentUserState = useSelector((state: any) => state.currentUser);


  return (
    <Box sx={{...LayoutStyles.globalSettingSubContainers('#ffffff'),color : colorPalette.darkBackground,height : 'calc(100vh - 80px)'}} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} textAlign={'start'} >Organization Id </Typography>
        <Typography color={'#808080'} >{currentUserState?.organization_id}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'}  >User’s Name </Typography>
        <Typography color={'#808080'} >{currentUserState?.name}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'}  >User’s Email </Typography>
        <Typography color={'#808080'} >{currentUserState?.email}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'}  >User Email Verified </Typography>
        <Typography color={'#808080'} >
          {currentUserState?.emailVerified === true ? 'Verified' : 'Not verified'}
        </Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'}  >Joined on </Typography>
        <Typography color={'#808080'} >{new Date(currentUserState?.created_at)?.toDateString()}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'}  >Authorized by </Typography>
        <Typography color={'#808080'} >{currentUserState?.oauth_provider?.toUpperCase()}</Typography>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default OrgGeneralSettings