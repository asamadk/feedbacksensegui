import { Autocomplete, Box, Button, Checkbox, FormControlLabel, InputLabel, TextField, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles';
import React, { useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system';
import { containedButton } from '../Styles/ButtonStyle';
import axios from 'axios';
import { createOrgForuser } from '../Utils/Endpoints';
import { useNavigate } from 'react-router';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { textFieldStyle } from '../Styles/InputStyles';

const CssTextField = styled(TextField)(textFieldStyle);

const subContainerCss = {
  borderRadius: '5px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  padding: '20px',
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  textAlign: 'start'
}

function LoginSuccess() {

  let navigate = useNavigate();
  const snackbarRef: any = useRef(null);

  const [newOrgName, setNewOrgName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const defaultColor = useSelector((state: any) => state.colorReducer);

  const handleContinueButtonClick = () => {
    createOrgForUser();
  }

  const createOrgForUser = async () => {    
    if (newOrgName?.length < 1 || address?.length < 1 || country?.length < 1 || pin.length < 1) {
      snackbarRef?.current?.show('Please fill all the values.', 'error');
      return;
    }
    try {
      setLoading(true);
      const saveObj = {
        orgName: newOrgName,
        address: address,
        country: country,
        pinCode: pin
      };
      const { data } = await axios.post(createOrgForuser(), saveObj, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      navigate('/');
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  return (
    <Box
      sx={{ ...LayoutStyles.settingLayoutStyle }}
      style={{ height: 'calc(100vh - 120px)' }}
    >
      <Box sx={{ ...subContainerCss, backgroundColor: colorPalette.textSecondary }} >
        <Box marginBottom={'10px'} >
          <Typography fontSize={'22px'} >Share a few details about you</Typography>
          <Typography color='#808080' fontSize={'14px'} >It will help us to get to know you better</Typography>
        </Box>
        <Box>
          <Box marginTop={'20px'} >
            <InputLabel sx={{ marginBottom: '5px', marginTop: '10px' }} >Enter Company name</InputLabel>
            <CssTextField
              size='small'
              id="outlined-basic"
              placeholder='Company'
              variant="outlined"
              style={{ width: '100%' }}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
          </Box>
          <Box marginTop={'20px'} >
            <InputLabel sx={{ marginBottom: '5px', marginTop: '10px' }} >Enter you address</InputLabel>
            <CssTextField
              size='small'
              id="outlined-basic"
              placeholder='Address'
              variant="outlined"
              style={{ width: '100%' }}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Box>
          <Box marginTop={'20px'} >
            <InputLabel sx={{ marginBottom: '5px', marginTop: '10px' }} >Enter you country</InputLabel>
            <CssTextField
              size='small'
              id="outlined-basic"
              placeholder='Country'
              variant="outlined"
              style={{ width: '100%' }}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Box>
          <Box marginTop={'20px'} >
            <InputLabel sx={{ marginBottom: '5px', marginTop: '10px' }} >Enter you pin code</InputLabel>
            <CssTextField
              size='small'
              id="outlined-basic"
              placeholder='Pin'
              type='number'
              variant="outlined"
              style={{ width: '100%' }}
              onChange={(e) => setPin(e.target.value)}
            />
          </Box>
        </Box>
        <Button style={{ marginTop: '20px' }} sx={containedButton} onClick={handleContinueButtonClick} >Continue</Button>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default LoginSuccess