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

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FFA500',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFA500',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  color: 'white'
});

const StyledDropdown = styled(Autocomplete)({
  '& label.Mui-focused': {
    color: '#FFA500',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFA500',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  color: 'white'
});

const subContainerCss = {
  borderRadius: '5px',
  backgroundColor: '#181818',
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
  const [selectedOrg, setSelectedOrg] = useState<string | null>(orgList[0]);
  const [selectedOrgValue, setSelectedOrgValue] = useState<any>('');
  const [loading, setLoading] = React.useState(false);

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
        navigate('/login');
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
        navigate('/login');
      }
    }
  }

  const createOrgForUser = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(createOrgForuser(newOrgName), { withCredentials: true });
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
        navigate('/login');
      }
    }
  }

  return (
    <Box sx={LayoutStyles.settingLayoutStyle} >
      <Box sx={subContainerCss} >
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
          <Box marginTop={'20px'} >
            <InputLabel sx={{ color: '#f1f1f1', marginBottom: '5px', marginTop: '10px' }} >Enter Company name</InputLabel>
            <CssTextField
              size='small'
              sx={{ input: { color: 'white' } }}
              id="outlined-basic"
              placeholder='Enter company name'
              variant="outlined"
              style={{ width: '100%' }}
              onChange={(e) => setNewOrgName(e.target.value)}
            />
          </Box>
        }

        {/* <FormControlLabel sx={{ color: 'white' }}
          control={<Checkbox onChange={(e) => setOtherComany(e.target.checked)} value={otherComany} />} label="Company not found ?"
        /> */}

        <Button sx={containedButton} onClick={handleContinueButtonClick} >Continue</Button>
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