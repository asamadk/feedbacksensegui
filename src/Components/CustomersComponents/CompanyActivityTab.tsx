import { Box, Button, Drawer, Grid, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { containedButton } from '../../Styles/ButtonStyle'
import { colorPalette } from '../../Utils/Constants'
import { taskStatusStyle } from '../../Styles/LayoutStyles';
import EmailIcon from '@mui/icons-material/Email';
import CallIcon from '@mui/icons-material/Call';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RecommendIcon from '@mui/icons-material/Recommend';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import MoodIcon from '@mui/icons-material/Mood';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AbcIcon from '@mui/icons-material/Abc';
import CreateActivityModal from '../../Modals/ContactModals/CreateActivityModal';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import axios from 'axios';
import { getActivitiesURL } from '../../Utils/Endpoints';

function CompanyActivityTab(props: { open: boolean, close: any,companyId : string | null }) {

  const snackbarRef: any = useRef(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [activities,setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let init = false;
  useEffect(() => {
    if(init === false){
      fetchActivities();
      init = true;
    }
  }, []);

  async function fetchActivities() {
    try {
      setLoading(true);
      const { data } = await axios.get(getActivitiesURL('',props.companyId as string),{withCredentials : true});
      if(data.data){
        setActivities(data.data);
      }
      setLoading(false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong','error');
      setLoading(false);
      handleUnAuth(error);
    }
  }

  function handleCreateModalClose(data: any) {
    setOpenCreateModal(false);
    if (data.refresh === true) {

    }
  }

  return (
    <>
      <Drawer
        anchor={'right'}
        open={props.open}
        onClose={props.close}
      >
        <Box
          sx={{ maxWidth: '700px', minWidth: '400px', padding: '20px' }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
            <Typography variant='h5' >Activities</Typography>
            {/* <Button 
              onClick={() => setOpenCreateModal(true)}
              sx={{ ...containedButton, width: 'fit-content', marginTop: '0' }} 
            >Log Activity</Button> */}
          </Box>
          <Box>
            {activities?.map(activity => <ActivityBlock activity={activity} />)}
          </Box>
        </Box>
      </Drawer>
      {
        openCreateModal &&
        <CreateActivityModal open={openCreateModal} close={handleCreateModalClose} />
      }
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </>
  )
}

export default CompanyActivityTab

const activityBlockContainer = {
  borderRadius: '5px',
  cursor: 'pointer',
  // height: '107px',
  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
  marginTop: '20px',
  padding: '20px',
  background: colorPalette.textSecondary
}

const iconStyle = {
  position: 'relative',
  top: '6px'
}

function ActivityBlock({ activity }: { activity: any }) {
  return <>
    <Box sx={activityBlockContainer} >
      <Typography color={colorPalette.primary} >
        {activity.type === 'Email' && <EmailIcon sx={iconStyle} />}
        {activity.type === 'Call' && <CallIcon sx={iconStyle} />}
        {activity.type === 'Meeting' && <MeetingRoomIcon sx={iconStyle} />}
        {activity.type === 'Support Ticket' && <RecommendIcon sx={iconStyle} />}
        {activity.type === 'Training' && <ModelTrainingIcon sx={iconStyle} />}
        {activity.type === 'Product Usage' && <DataUsageIcon sx={iconStyle} />}
        {activity.type === 'Survey' && <MoodIcon sx={iconStyle} />}
        {activity.type === 'Update' && <UpgradeIcon sx={iconStyle} />}
        {activity.type === 'Note' && <NoteAltIcon sx={iconStyle} />}
        {activity.type === 'Other' && <AbcIcon sx={iconStyle} />}
        <b>{activity?.type}</b>
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Subject : </b>{activity?.subject}
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Description : </b>{activity?.description}
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Company : </b>{activity?.company?.name}
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Person : </b>{activity?.person?.firstName}
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Owner : </b>{activity?.owner?.name}
      </Typography>
      <Typography color={colorPalette.darkBackground} >
        <b style={{ color: colorPalette.fsGray }} >Start/End Date : </b>
        {`${activity?.startTime} - ${activity?.endTime || 'N/A'}`}
      </Typography>
      <Box sx={{ ...taskStatusStyle(activity?.status), margin: '10px 0px' }} >
        <Typography>{activity?.status}</Typography>
      </Box>
    </Box>
  </>
}