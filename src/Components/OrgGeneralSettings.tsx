import { Box, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React, { useRef } from 'react'
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useSelector } from 'react-redux';


function OrgGeneralSettings() {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const defaultColor = useSelector((state: any) => state.colorReducer);
  const currentUserState = useSelector((state: any) => state.currentUser);


  return (
    <Box sx={LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor)} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Id </Typography>
        <Typography color={'#808080'} >{currentUserState?.organization_id}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Name </Typography>
        <Typography color={'#808080'} >{currentUserState?.name}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Email </Typography>
        <Typography color={'#808080'} >{currentUserState?.email}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User Email Verified </Typography>
        <Typography color={'#808080'} >
          {currentUserState?.emailVerified === true ? 'Verified' : 'Not verified'}
        </Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Joined on </Typography>
        <Typography color={'#808080'} >{new Date(currentUserState?.created_at)?.toDateString()}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Authorized by </Typography>
        <Typography color={'#808080'} >{currentUserState?.oauth_provider?.toUpperCase()}</Typography>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default OrgGeneralSettings