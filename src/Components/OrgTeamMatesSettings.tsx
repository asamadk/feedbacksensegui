import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'


const subscriptionDetailList = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px #454545 solid',
  paddingTop: '10px',
  paddingBottom: '10px'
}

const usersList = [
  {
    name: 'Abdul Samad Kirmani',
    email: 'abdulSamad@gmail.com'
  },
  {
    name: 'Abdul Samad Kirmani bin Khalid Hasan',
    email: 'abdulSamad@gmail.com'
  },
  {
    name: 'Abdul Samad Kirmani',
    email: 'abdulSamad@gmail.com'
  },
  {
    name: 'Abdul Samad Kirmani',
    email: 'abdulSamad@gmail.com'
  },
]

function OrgTeamMatesSettings() {

  const [openInviteModal, setOpeninviteModal] = React.useState(false);

  const handleOpenInviteModal = () => setOpeninviteModal(true);
  const handleCloseInviteModal = () => setOpeninviteModal(false);


  return (
    <Box sx={LayoutStyles.globalSettingSubContainers} >
      <Box sx={{ textAlign: 'end', marginBottom: '50px' }} >
        <Button style={{ width: 'fit-content' }} sx={ButtonStyles.containedButton} onClick={handleOpenInviteModal} variant="contained">Invite Teammantes</Button>
      </Box>
      <Box>
        <Box sx={subscriptionDetailList} style={{ border: 'none' }}>
          <Typography color={'#f1f1f1'} >Name </Typography>
          <Typography color={'#f1f1f1'} >E-mail </Typography>
          {/* <Typography color={'#454545'} > </Typography> */}
        </Box>
        {
          usersList.map((user) => {
            return (
              <Box sx={subscriptionDetailList} style={{ borderTop: '1px #454545 solid' }} >
                <Typography color={'#454545'} >{user.name} </Typography>
                <Typography color={'#454545'} >{user.email} </Typography>
                {/* <Typography color={'#454545'} > </Typography> */}
              </Box>
            )
          })
        }
      </Box>
      <InviteMemberModal open={openInviteModal}  close={handleCloseInviteModal} />
    </Box>
  )
}

export default OrgTeamMatesSettings