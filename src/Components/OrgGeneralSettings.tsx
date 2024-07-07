import { Box, Tab, Tabs, Typography } from '@mui/material'
import * as LayoutStyles from '../Styles/LayoutStyles'
import React, { useRef } from 'react'
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { useSelector } from 'react-redux';
import { colorPalette } from '../Utils/Constants';
import Avatar from 'react-avatar';
import { getHealthScoreStyle } from '../Styles/TableStyle';


//TODO all the notifications permission,editing account,daily digest will be handled in this component
function OrgGeneralSettings() {

  const snackbarRef: any = useRef(null);

  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState('1');
  const currentUserState = useSelector((state: any) => state.currentUser);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  function GetTabData() {
    if (value === '1') { return UserDetails() }
    else { return ComingSoon() }
  }

  function ComingSoon() {
    return <Box padding={'20px'} >
      <Typography variant='h6' fontWeight={600} >Coming Soon!</Typography>
      <Typography sx={{color : colorPalette.fsGray}} >
        Feature under development, you will be amongst the first to be notified about the release
      </Typography>
    </Box>
  }

  function UserDetails() {
    return <Box padding={'20px'} >
      <Box display={'flex'} marginBottom={2}  >
        <Typography width={200} fontWeight={600} textAlign={'start'} >Organization Id </Typography>
        <Typography color={'#808080'} >{currentUserState?.organization_id}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} fontWeight={600} textAlign={'start'}  >User’s Name </Typography>
        <Typography color={'#808080'} >{currentUserState?.name}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} fontWeight={600} textAlign={'start'}  >User’s Email </Typography>
        <Typography color={'#808080'} >{currentUserState?.email}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} fontWeight={600} textAlign={'start'}  >User Email Verified </Typography>
        <Box sx={{...getHealthScoreStyle(currentUserState?.emailVerified === true ? 100 : 0),margin : 0}} >
          {currentUserState?.emailVerified === true ? 'Verified' : 'Not verified'}
        </Box>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} fontWeight={600} textAlign={'start'}  >Joined on </Typography>
        <Typography color={'#808080'} >{new Date(currentUserState?.created_at)?.toDateString()}</Typography>
      </Box>
      <Box display={'flex'} marginBottom={2}>
        <Typography width={200} fontWeight={600} textAlign={'start'}  >Authorized by </Typography>
        <Typography color={'#808080'} >{currentUserState?.oauth_provider?.toUpperCase()}</Typography>
      </Box>
    </Box>
  }

  return (
    <Box sx={{ ...LayoutStyles.globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 80px)' }} >
      <Box>
        <Avatar name={currentUserState?.name} round='50px' maxInitials={2} />
        <Typography fontWeight={600} >{currentUserState?.name}</Typography>
        <Typography color={'#808080'} >{currentUserState?.email}</Typography>
        <Typography color={'#808080'} >{new Date(currentUserState?.created_at)?.toDateString()}</Typography>
      </Box>

      <Box sx={{ background: colorPalette.textSecondary, marginTop: '20px' }} >
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="1" label="Details" />
          <Tab value="2" label="Notifications" />
          <Tab value="3" label="Integrations" />
        </Tabs>
      </Box>

      <Box sx={{ height: 'calc(100vh - 320px)', overflowY: 'auto' }} >
        {GetTabData()}
      </Box>

      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default OrgGeneralSettings