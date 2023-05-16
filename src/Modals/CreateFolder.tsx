import { Box, Button, IconButton, InputLabel, Modal, styled, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import CloseIcon from '@mui/icons-material/Close';
import { USER_LOCAL_KEY, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { authUser } from '../Utils/types';
import { createFolder } from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';

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

const textFieldStyle = {
    paddingTop: '30px'
}

function CreateFolder(props: any) {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const [folderName, setFolderName] = useState<string>('');
    const [loading, setLoading] = React.useState(false);

    const handleCreateButtonClick = async () => {
        try {
            const currentUser: string | null = localStorage.getItem(USER_LOCAL_KEY);
            if (currentUser == null) {
                snackbarRef?.current?.show('Unauthorized', 'error');
                return;
            }
            const authenticatedUser: authUser = JSON.parse(currentUser);
            setLoading(true);
            const { data } = await axios.post(createFolder(folderName), {}, { withCredentials: true });
            setLoading(false);

            if (data.statusCode === 200) {
                snackbarRef?.current?.show(data?.message, 'success');
                setFolderName('');
                props.close('save');
            } else {
                snackbarRef?.current?.show(data?.message, 'error');
                console.warn(data.message)
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
                navigate('/login');
            }
        }
    }

    const handleClose = () => {
        setFolderName('');
        props.close();
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Create folder
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>
                    <Box sx={textFieldStyle} >
                        <InputLabel style={{ color: '#f1f1f1', paddingBottom: '3px' }} htmlFor="component-simple">Name your folder</InputLabel>
                        <CssTextField
                            size='small'
                            sx={{ input: { color: 'white' } }}
                            id="outlined-basic"
                            placeholder='Folder name'
                            value={folderName}
                            variant="outlined"
                            style={{ width: '100%' }}
                            onChange={(e: any) => setFolderName(e.target.value)}
                        />
                    </Box>
                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={ButtonStyles.outlinedButton}
                            onClick={handleClose}
                            variant="contained">
                            Cancel
                        </Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            sx={ButtonStyles.containedButton}
                            variant="contained"
                            loading={loading}
                            onClick={handleCreateButtonClick} >
                            Create
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateFolder