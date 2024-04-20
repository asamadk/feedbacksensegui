import React, { useEffect, useRef, useState } from 'react'
import { Avatar, Button, Chip, IconButton, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import Notification from '../Utils/Notification';
import axios from 'axios';
import { updateUserRoleAPI } from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import { TEAM_ROLES } from '../Utils/CustomSettingsConst';
import UpgradePlanError from '../Components/UpgradePlanError';

function UserDetailsModal({ open, close, user, roles, updateUser }: any) {

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const settings = useSelector((state: any) => state.settings);

    const snackbarRef: any = useRef(null);

    const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN' | 'USER' | 'GUEST'>(user?.role);
    const [loading, setLoading] = React.useState(false);
    const [teamRolesFeatureActive, setTeamRolesFeatureActive] = React.useState(false);

    useEffect(() => {
        handlePlanVisibility();
    }, []);

    const handlePlanVisibility = () => {
        if (settings != null && settings[TEAM_ROLES] === 'true') {
            setTeamRolesFeatureActive(true);
        } else {
            setTeamRolesFeatureActive(false);
        }
    }

    useEffect(() => {
        setUserRole(user?.role);
    }, [user?.role]);

    const handleOwnerChange = (e: any) => {
        setUserRole(e.target.value)
    }

    const handleUpdateUser = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                updateUserRoleAPI(),
                { userId: user?.id, role: userRole },
                { withCredentials: true }
            );
            setLoading(false);
            snackbarRef?.current?.show(data?.message, 'success');
            close();
            updateUser(userRole);
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    return (
        <>
            <Modal
                open={open}
                onClose={close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...ModalStyles.modalStyle(colorPalette.background) }}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            User Details
                        </Typography>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={close} />
                        </IconButton>
                    </Box>

                    <Box sx={{ padding: '20px', borderRadius: '10px', margin: '5px' }} >
                        <Box display={'flex'}>
                            <Avatar
                                sx={{ bgcolor: colorPalette.primary, width: 24, height: 24, fontSize: 14, mt: '15px', mr: '15px' }}
                                alt={user?.name}
                                src={user?.image}
                            />
                            <Box textAlign={'start'} >
                                <Typography variant='h6' color={colorPalette.darkBackground}>{user?.name}</Typography>
                                <Typography color={colorPalette.darkBackground} >{user?.email}</Typography>
                                <Typography color={colorPalette.darkBackground} >{user?.role}</Typography>
                                <Typography color={colorPalette.darkBackground} >{new Date(user?.created_at).toString()}</Typography>
                            </Box>
                        </Box>
                        {
                            teamRolesFeatureActive ?
                                <Box marginLeft={'35px'} marginTop={'20px'} >
                                    <Box>
                                        <InputLabel id="demo-simple-select-label">Change Role</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            size='small'
                                            fullWidth
                                            sx={{ marginTop: '5px' }}
                                            value={userRole}
                                            onChange={handleOwnerChange}
                                        >
                                            {
                                                roles?.map((role: string) => (
                                                    <MenuItem value={role}>{role}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </Box>
                                </Box> :
                                <Box textAlign={'center'} marginTop={'20px'} >
                                    <UpgradePlanError
                                        message='Upgrade for Teammates roles'
                                        desc='Manage teammates roles right from here, Upgrade to Pro Plan to access this resource.'
                                        showButton={true}
                                    />
                                </Box>
                        }
                    </Box>

                    {
                        teamRolesFeatureActive &&
                        <Box sx={ModalStyles.modalButtonContainerStyle} >
                            <Button
                                style={{ width: 'fit-content', marginRight: '15px' }}
                                sx={ButtonStyles.outlinedButton}
                                variant="outlined"
                                onClick={close}
                            >Close</Button>
                            <LoadingButton
                                style={{ width: 'fit-content' }}
                                sx={ButtonStyles.containedButton}
                                variant="contained"
                                loading={loading}
                                onClick={handleUpdateUser} >
                                Update
                            </LoadingButton>
                        </Box>
                    }
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default UserDetailsModal