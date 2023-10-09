import { Autocomplete, Box, Button, Checkbox, FormControlLabel, InputLabel, TextField, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles';
import React, { useEffect, useRef, useState } from 'react'
import { styled } from '@mui/system';
import { containedButton } from '../Styles/ButtonStyle';
import axios from 'axios';
import { createOrgForuser, getOrgList, pointOrgToUser } from '../Utils/Endpoints';
import { useNavigate } from 'react-router';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#006DFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006DFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006DFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006DFF',
    },
  },
  color: 'white'
});

const StyledDropdown = styled(Autocomplete)({
  '& label.Mui-focused': {
    color: '#006DFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#006DFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#006DFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#006DFF',
    },
  },
  color: 'white'
});

const subContainerCss = {
  borderRadius: '5px',
  border: '1px #454545 solid',
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

  const [orgList, setOrgList] = useState<any[]>([]);
  const [otherComany, setOtherComany] = useState<boolean>(true);
  const [newOrgName, setNewOrgName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [pin,setPin] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(orgList[0]);
  const [selectedOrgValue, setSelectedOrgValue] = useState<any>('');
  const [loading, setLoading] = React.useState(false);
  const defaultColor = useSelector((state: any) => state.colorReducer);

  useEffect(() => {
    fetchAllOrgList();
  }, []);

  const convertListToOptionList = (temoOrgList: any[]) => {
    if (temoOrgList == null) {
      temoOrgList = [];
    }
    const orgs: any[] = [];
    temoOrgList.forEach(org => {
      orgs.push({
        label: org.name,
        id: org.id
      })
    })

    setOrgList(orgs);
  }

  const fetchAllOrgList = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(getOrgList(), { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      if (data != null) {
        let temoOrgList: any[] = data.data;
        convertListToOptionList(temoOrgList);
      }
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const handleContinueButtonClick = () => {
    if (otherComany === true) {
      createOrgForUser();
    } else {
      pointExistingOrgToCurrentUser();
    }
  }

  const handleSelectValue = (newValue: string | null) => {
    setSelectedOrg(newValue);
  }

  const pointExistingOrgToCurrentUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(pointOrgToUser(), selectedOrg, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }

      if (data.statusCode === 200) {
        snackbarRef?.current?.show(data?.message, 'success');
        navigate('/');
      }
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const createOrgForUser = async () => {
    if(newOrgName?.length < 1 || address?.length < 1 || country?.length < 1 || pin.length < 1){
      snackbarRef?.current?.show('Please fill all the values.', 'error');
      return;
    }
    try {
      setLoading(true);
      const saveObj = {
        orgName :newOrgName, 
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

      if (data.statusCode === 200) {
        navigate('/');
      }
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  return (
    <Box 
      sx={{...LayoutStyles.settingLayoutStyle,backgroundColor : defaultColor?.backgroundColor}} 
      style={{ height: 'calc(100vh - 120px)' }} 
    >
      <Box sx={{...subContainerCss,backgroundColor: defaultColor?.secondaryColor}} >
        <Box marginBottom={'10px'} >
          <Typography color='#f1f1f1' fontSize={'22px'} >Share a few details about you</Typography>
          <Typography color='#808080' fontSize={'14px'} >It will help us to get to know your better</Typography>
        </Box>

        {
          otherComany === false &&
          <Box>
            <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '20px' }} >Company</InputLabel>
            <StyledDropdown
              style={{ width: '100%' }}
              sx={{ input: { color: 'white' } }}
              id="combo-box-demo"
              options={orgList}
              value={selectedOrg}
              onChange={(event: any, newValue: any) => handleSelectValue(newValue)}
              inputValue={selectedOrgValue}
              onInputChange={(event, newInputValue) => {
                setSelectedOrgValue(newInputValue);
              }}
              size='small'
              placeholder='Select company'
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>

        }

        {
          otherComany === true &&
          <Box>
            <Box marginTop={'20px'} >
              <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '10px' }} >Enter Company name</InputLabel>
              <CssTextField
                size='small'
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Company'
                variant="outlined"
                style={{ width: '100%' }}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
            </Box>
            <Box marginTop={'20px'} >
              <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '10px' }} >Enter you address</InputLabel>
              <CssTextField
                size='small'
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Address'
                variant="outlined"
                style={{ width: '100%' }}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Box>
            <Box marginTop={'20px'} >
              <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '10px' }} >Enter you country</InputLabel>
              <CssTextField
                size='small'
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Country'
                variant="outlined"
                style={{ width: '100%' }}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Box>
            <Box marginTop={'20px'} >
              <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '10px' }} >Enter you pin code</InputLabel>
              <CssTextField
                size='small'
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                placeholder='Pin'
                type='number'
                variant="outlined"
                style={{ width: '100%' }}
                onChange={(e) => setPin(e.target.value)}
              />
            </Box>
          </Box>
        }

        {/* <FormControlLabel sx={{ color: 'white' }}
          control={<Checkbox onChange={(e) => setOtherComany(e.target.checked)} value={otherComany} />} label="Company not found ?"
        /> */}

        <Button style={{ marginTop: '20px' }} sx={containedButton} onClick={handleContinueButtonClick} >Continue</Button>
      </Box>
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
]

export default LoginSuccess