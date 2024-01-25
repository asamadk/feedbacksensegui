import { Avatar, Box, Button, Chip, IconButton, MenuItem, Select, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal'
import DeleteIcon from '@mui/icons-material/Delete';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'
import EditIcon from '@mui/icons-material/Edit';
import UserDetailsModal from '../Modals/UserDetailsModal'
import GenericModal from '../Modals/GenericModal';
import { genericModalData, userRoleType } from '../Utils/types';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { handleLogout } from '../Utils/FeedbackUtils';
import { USER_UNAUTH_TEXT, colorPalette, componentList, componentName } from '../Utils/Constants';
import { deleteUserRoleAPI, getUserListAPI } from '../Utils/Endpoints';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { useDispatch } from 'react-redux';
import { setUsers } from '../Redux/Reducers/usersReducer';

const singleUserContainer = (bgColor: string) => {
  return {
    backgroundColor: bgColor,
    borderRadius: '10px',
    marginTop: '15px',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
  }
}

const userRoles = [
  'OWNER',
  'ADMIN',
  'USER',
  'GUEST'
]

function OrgTeamMatesSettings() {

  const snackbarRef: any = useRef(null);
  const dispatch = useDispatch();

  const [openInviteModal, setOpenInviteModal] = React.useState(false);
  const [openDetailsModal, setOpenDetailsModal] = React.useState(false);
  const [showGenericModal, setShowGenericModal] = React.useState(false);
  const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
  const [selectedUser, setSelectedUser] = useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const defaultColor = useSelector((state: any) => state.colorReducer);
  const userRole: userRoleType = useSelector((state: any) => state.userRole);
  const userState = useSelector((state: any) => state.users);

  let initialized = false;

  useEffect(() => {
    if (initialized === false) {
      getUserList();
      initialized = true;
    }
  }, []);

  const handleOpenInviteModal = () => setOpenInviteModal(true);
  const handleCloseInviteModal = () => setOpenInviteModal(false);
  
  const handleOpenDetailModal = (user: any) => {
    setOpenDetailsModal(true);
    setSelectedUser(user);
  }
  const handleCloseDetailModal = () => setOpenDetailsModal(false);

  const handleSuccessButtonClick = async () => {
    setShowGenericModal(false);
    try {
      setLoading(true);
      const { data } = await axios.post(
        deleteUserRoleAPI(),
        { ...genericModalObj?.data },
        { withCredentials: true }
      );
      setLoading(false);
      snackbarRef?.current?.show(data?.message, 'success');
      deleteUserRerender(genericModalObj?.data.userId);
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const handleDeleteButtonClick = (userId: string) => {
    setShowGenericModal(true);
    let genDeleteObj: genericModalData = {
      header: 'You are removing a user!',
      warning: 'Warning: There\'s no turning back! I acknowledge that',
      successButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      description: 'The user will be removed from FeedbackSense.',
      type: 'delete',
      data: {
        userId: userId
      }
    }
    setGenericModalObj(genDeleteObj);
  }

  const getUserList = async (): Promise<void> => {
    try {
      if (userState == null || userState.length < 1) {
        setLoading(true);
        let { data } = await axios.get(getUserListAPI(), { withCredentials: true });
        setLoading(false);
        if (data?.statusCode !== 200) {
          snackbarRef?.current?.show(data?.message, 'error');
          return;
        }

        if (data.data != null) {
          dispatch(setUsers(data.data))
        }
      }
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const deleteUserRerender = (userId: string) => {
    const updatedUserList = userState.filter((user: any) => user.id !== userId);
    dispatch(setUsers(updatedUserList));
  }

  // const handleOwnerChange = (role : userRoleType) => {
  //   const tempUser = JSON.parse(JSON.stringify(selectedUser));
  //   tempUser.role = role
  //   setSelectedUser(tempUser);
  // }

  const updateUser = (newRole: string) => {
    const tempUser: any[] = JSON.parse(JSON.stringify(userState));
    tempUser.forEach(usr => {
      if (usr.id === selectedUser.id) {
        usr.role = newRole
        return
      }
    });
    dispatch(setUsers(tempUser));
  }

  const SingleUserList = (user: any) => {
    return (
      <Box sx={singleUserContainer(colorPalette.textSecondary)} >
        <Box display={'flex'} >
          <Avatar sx={{ bgcolor: colorPalette.secondary, width: 24, height: 24, fontSize: 14, mt: '15px', mr: '15px' }} alt={user?.name} src={user?.image} />
          <Box textAlign={'start'} >
            <Typography variant='h6' color={colorPalette.textPrimary}>{user?.name}</Typography>
            <Typography fontSize={'13px'} color={'#808080'} >{user?.email}</Typography>
          </Box>
        </Box>
        <Box marginTop={'5px'} >
          <Chip sx={{ width: '70px' }} label={user?.role} />
          {
            CoreUtils.isComponentVisible(userRole, componentName.MANAGE_USER) &&
            <IconButton onClick={() => handleOpenDetailModal(user)} sx={{ marginLeft: '10px' }} >
              <EditIcon sx={{ color: '#808080' }} />
            </IconButton>
          }
          {
            CoreUtils.isComponentVisible(userRole, componentName.DELETE_USER) &&
            <IconButton onClick={() => handleDeleteButtonClick(user?.id)} sx={{ marginLeft: '5px' }} >
              <DeleteIcon sx={{ color: '#808080' }} />
            </IconButton>
          }
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={LayoutStyles.globalSettingSubContainers('#ffffff')} >
      <Box sx={{ display: 'flex', marginBottom: '50px', justifyContent: 'space-between' }} >
        <Typography variant='h5' color={colorPalette.darkBackground} marginTop={'10px'} >Users</Typography>
        {
          CoreUtils.isComponentVisible(userRole, componentName.TEAMMATES_INVITE) &&
          <Button
            style={{ width: 'fit-content' }}
            sx={ButtonStyles.containedButton}
            onClick={handleOpenInviteModal}
            variant="contained"
          >Invite Teammantes</Button>
        }
      </Box>
      <Box>
        {
          userState?.map((user: any) => {
            return (
              <Box key={user.email} >
                {SingleUserList(user)}
              </Box>
            )
          })
        }
      </Box>
      <InviteMemberModal open={openInviteModal} close={handleCloseInviteModal} />
      {
        openDetailsModal &&
        <UserDetailsModal
          user={selectedUser}
          open={openDetailsModal}
          close={handleCloseDetailModal}
          roles={userRoles}
          updateUser={updateUser}
        />
      }
      <GenericModal
        payload={genericModalObj}
        close={() => setShowGenericModal(false)}
        open={showGenericModal}
        callback={handleSuccessButtonClick}
        dualConfirmation={true}
      />
      <FSLoader show={loading} />
      <Notification ref={snackbarRef} />
    </Box>
  )
}

export default OrgTeamMatesSettings