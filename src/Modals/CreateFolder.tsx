import { Box, Button, IconButton, InputLabel, Modal, styled, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import CloseIcon from '@mui/icons-material/Close';
import { colorPalette, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { createFolder } from '../Utils/Endpoints';
import axios from 'axios';
import Notification from '../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { textFieldStyle } from '../Styles/InputStyles';

const CssTextField = styled(TextField)(textFieldStyle);

const textFieldStyleCSS = {
    paddingTop: '30px'
}

function CreateFolder(props: any) {

    const snackbarRef: any = useRef(null);
    const [folderName, setFolderName] = useState<string>('');
    const [loading, setLoading] = React.useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);

    const handleCreateButtonClick = async () => {
        try {
            if (folderName == null || folderName.length < 1) {
                snackbarRef?.current?.show('Please give folder a name', 'error');
                return;
            }
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
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
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
                <Box sx={ModalStyles.modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Create folder
                        </Typography>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>
                    <Box sx={textFieldStyleCSS} >
                        <InputLabel style={{ color: colorPalette.darkBackground, paddingBottom: '3px' }} htmlFor="component-simple">Name your folder</InputLabel>
                        <CssTextField
                            size='small'
                            sx={{ input: { color: colorPalette.darkBackground } }}
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