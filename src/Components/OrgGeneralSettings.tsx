import { Box, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React, { useEffect, useRef, useState } from 'react'
import { USER_LOCAL_KEY, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { checkLoginStatus } from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';


function OrgGeneralSettings() {

  const snackbarRef: any = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [userDetail, setUserDetail] = useState<any>();
  const defaultColor = useSelector((state: any) => state.colorReducer);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(checkLoginStatus(), { withCredentials: true });
      setLoading(false);
      if (data.statusCode === 200) {
        setUserDetail(data.data);
      } else {
        snackbarRef?.current?.show(data?.message, 'error');
      }
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if(error?.response?.data?.message === USER_UNAUTH_TEXT){
        handleLogout();
      }
    }
  }

  return (
    <Box sx={LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor)} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Organization Id </Typography>
        <Typography color={'#808080'} >{userDetail?.organization_id}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Name </Typography>
        <Typography color={'#808080'} >{userDetail?.name}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User’s Email </Typography>
        <Typography color={'#808080'} >{userDetail?.email}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >User Email Verified </Typography>
        <Typography color={'#808080'} >
          {userDetail?.emailVerified === true ? 'Verified' : 'Not verified'}
        </Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Joined on </Typography>
        <Typography color={'#808080'} >{new Date(userDetail?.created_at)?.toDateString()}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} textAlign={'start'} color={'#f1f1f1'} >Authorized by </Typography>
        <Typography color={'#808080'} >{userDetail?.oauth_provider.toUpperCase()}</Typography>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default OrgGeneralSettings