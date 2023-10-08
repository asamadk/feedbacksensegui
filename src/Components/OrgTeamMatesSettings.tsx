import { Avatar, Box, Button, Chip, IconButton, MenuItem, Select, Typography } from '@mui/material'
import React, { useState } from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal'
import DeleteIcon from '@mui/icons-material/Delete';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'
import EditIcon from '@mui/icons-material/Edit';
import UserDetailsModal from '../Modals/UserDetailsModal'
import GenericModal from '../Modals/GenericModal';
import { genericModalData } from '../Utils/types';

const singleUserContainer = {
  backgroundColor: '#323533',
  borderRadius: '10px',
  marginTop: '15px',
  padding: '10px',
  display: 'flex',
  justifyContent: 'space-between'
}

const usersList = [
  {
    name: 'Abdul Samad Kirmani',
    email: 'samad@feedbacksense.io',
    role: 'OWNER'
  },
  {
    name: 'Adam Perret',
    email: 'adam@feedbacksense.io',
    role: 'ADMIN'
  },
  {
    name: 'Brett Quizo',
    email: 'brett@feedbacksense.io',
    role: 'USER'
  },
  {
    name: 'Dino James',
    email: 'dino@feedbacksense.io',
    role: 'GUEST'
  },
  {
    name: 'Ankit',
    email: 'ankit@feedbacksense.io',
    role: 'GUEST'
  },
]

const userRoles = [
  'OWNER',
  'ADMIN',
  'USER',
  'GUEST'
]

function OrgTeamMatesSettings() {

  const [openInviteModal, setOpenInviteModal] = React.useState(false);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [showGenericModal, setShowGenericModal] = React.useState(false);
  const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
  const [selectedUser, setSelectedUser] = useState({});

  const handleOpenInviteModal = () => setOpenInviteModal(true);
  const handleCloseInviteModal = () => setOpenInviteModal(false);
  const handleOpenDetailModal = (user: any) => {
    setOpenDetailsModal(true);
    setSelectedUser(user);
  }
  const handleCloseDetailModal = () => setOpenDetailsModal(false);

  const handleSuccessButtonClick = () => {
    console.log('DELETE USER');
    setShowGenericModal(false);
  }

  const handleDeleteButtonClick = () => {
    setShowGenericModal(true);
    let genDeleteObj: genericModalData = {
      header: 'You are removing a user!',
      warning: 'Warning: There\'s no turning back! I acknowledge that',
      successButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      description: 'The user will be removed from FeedbackSense.',
      type: 'delete',
    }
    setGenericModalObj(genDeleteObj);
  }


  const SingleUserList = (user: any) => {
    return (
      <Box sx={singleUserContainer} >
        <Box display={'flex'} >
          <Avatar sx={{ bgcolor: '#006DFF', width: 24, height: 24, fontSize: 14, mt: '15px', mr: '15px' }} alt={user?.name} src={user?.image} />
          <Box textAlign={'start'} >
            <Typography variant='h6' color={'white'}>{user?.name}</Typography>
            <Typography fontSize={'13px'} color={'#808080'} >{user?.email}</Typography>
          </Box>
        </Box>
        <Box marginTop={'5px'} >
          <Chip sx={{ width: '70px' }} label={user?.role} />
          <IconButton onClick={() => handleOpenDetailModal(user)} sx={{ marginLeft: '10px' }} >
            <EditIcon sx={{ color: '#808080' }} />
          </IconButton>
          <IconButton onClick={handleDeleteButtonClick} sx={{ marginLeft: '5px' }} >
            <DeleteIcon sx={{ color: '#808080' }} />
          </IconButton>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={LayoutStyles.globalSettingSubContainers} >
      <Box sx={{ display: 'flex', marginBottom: '50px', justifyContent: 'space-between' }} >
        <Typography variant='h5' color={'white'} marginTop={'10px'} >Users</Typography>
        <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} onClick={handleOpenInviteModal} variant="contained">Invite Teammantes</Button>
      </Box>
      <Box>
        {
          usersList.map((user) => {
            return (
              <Box key={user.email} >
                {SingleUserList(user)}
              </Box>
            )
          })
        }
      </Box>
      <InviteMemberModal open={openInviteModal} close={handleCloseInviteModal} />
      <UserDetailsModal
        user={selectedUser}
        open={openDetailsModal}
        close={handleCloseDetailModal}
        roles={userRoles}
      />
      <GenericModal
        payload={genericModalObj}
        close={() => setShowGenericModal(false)}
        open={showGenericModal}
        callback={handleSuccessButtonClick}
      />
    </Box>
  )
}

export default OrgTeamMatesSettings