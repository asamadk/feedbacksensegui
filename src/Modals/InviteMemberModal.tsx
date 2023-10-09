import { Button, FormControlLabel, IconButton, InputLabel, MenuItem, Modal, Select, styled, Switch, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import Notification from '../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import axios from 'axios';
import { inviteUserAPI } from '../Utils/Endpoints';

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

const textFieldStyle = {
    paddingTop: '30px'
}

function InviteMemberModal(props: any) {

    const roles = [
        'OWNER',
        'ADMIN',
        'USER',
        'GUEST'
    ]

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const snackbarRef: any = useRef(null);

    const [loading, setLoading] = React.useState(false);
    const [userRole, setUserRole] = useState<'OWNER' | 'ADMIN' | 'USER' | 'GUEST'>('GUEST');
    const [emails, setEmail] = useState<string>('');

    const handleTeamMemberInvite = async () => {
        try {
            if (
                emails.length < 1 || emails.split(',').length < 1 ||
                userRole == null || userRole?.length < 1
            ) {
                snackbarRef?.current?.show('Please fill all the values.', 'error');
            }
            setLoading(true);
            const { data } = await axios.post(
                inviteUserAPI(),
                { email: emails, role: userRole },
                { withCredentials: true }
            );
            setLoading(false);
            snackbarRef?.current?.show(data?.message, 'success');
            handleClose();
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleClose = () => {
        setUserRole('GUEST');
        setEmail('');
        props.close();
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Invite your team members !
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box sx={textFieldStyle} >
                        <InputLabel htmlFor="component-simple" sx={{ mb: '5px' }} >E-mail(s)</InputLabel>
                        <CssTextField
                            sx={{ input: { color: 'white' } }}
                            size='small'
                            id="outlined-basic"
                            placeholder='e.g sam@example.io'
                            variant="outlined"
                            style={{ width: '100%' }}
                            value={emails}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Box>

                    <Box marginTop={'20px'} >
                        <InputLabel id="demo-simple-select-label" sx={{ mb: '5px' }} >Choose Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            size='small'
                            fullWidth
                            value={userRole}
                            onChange={(e: any) => setUserRole(e.target.value)}
                        >
                            {
                                roles?.map((role: string) => (
                                    <MenuItem value={role}>{role}</MenuItem>
                                ))
                            }
                        </Select>
                    </Box>
                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={ButtonStyles.outlinedButton}
                            onClick={handleClose}
                            variant="contained"
                        >Cancel</Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={ButtonStyles.containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={handleTeamMemberInvite} >
                            Invite
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default InviteMemberModal