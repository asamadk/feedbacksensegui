import { Box, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React, { useEffect, useState } from 'react'
import { USER_LOCAL_KEY } from '../Utils/Constants';


function OrgGeneralSettings() {

  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    getUserDetails();
  },[]);

  const getUserDetails =() => {
    const userData = localStorage.getItem(USER_LOCAL_KEY);
    if(userData != null){
      setUserDetail(JSON.parse(userData));
      console.log("🚀 ~ file: OrgGeneralSettings.tsx:19 ~ getUserDetails ~ JSON.parse(userData):", JSON.parse(userData))
    }
  }

  return (
    <Box sx={LayoutStyles.globalSettingSubContainers} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Id </Typography>
        <Typography color={'#454545'} >{userDetail?.organization_id}</Typography>
      </Box>
      {/* <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Owner </Typography>
        <Typography color={'#454545'} >Abdul Samad Kirmani</Typography>
      </Box> */}
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Name </Typography>
        <Typography color={'#454545'} >{userDetail?.name}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Email </Typography>
        <Typography color={'#454545'} >{userDetail?.email}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User Email Verified </Typography>
        <Typography color={'#454545'} >
          {userDetail?.emailVerified === true ? 'Verified' : 'Not verified'}
        </Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Joined on </Typography>
        <Typography color={'#454545'} >{new Date(userDetail?.created_at)?.toLocaleDateString()}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Authorized by </Typography>
        <Typography color={'#454545'} >{userDetail?.oauth_provider.toUpperCase()}</Typography>
      </Box>
    </Box>
  )
}

export default OrgGeneralSettings