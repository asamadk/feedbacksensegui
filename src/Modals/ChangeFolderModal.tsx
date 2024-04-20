import { Button, IconButton, MenuItem, Modal, Select, Typography } from '@mui/material'
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close';
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import * as InputStyles from '../Styles/InputStyles';
import React, { useEffect, useRef } from 'react'
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import * as Endpoints from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

function ChangeFolderModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [selectedFolder, setSelectedFolder] = React.useState<string>('0');
    const [loading, setLoading] = React.useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const folderState = useSelector((state: any) => state.folders);


    const handleFolderChange = async () => {
        try {
            if (selectedFolder === '0') {
                snackbarRef?.current?.show('Please select a valid folder', 'error');
                return;
            }
            let surveyId = props.surveyId;
            setLoading(true);
            let { data } = await axios.post(Endpoints.moveSurveyFolder(surveyId, selectedFolder), {}, { withCredentials: true });
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            snackbarRef?.current?.show(data?.message, 'success');
            setTimeout(() => {
                setLoading(false);
                let surveyData = data.data;
                props.callback(surveyData);
                props.close();
            },1500);
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const handleDropdownChange = (event: any) => {
        let tempSearchText: string = event.target.value;
        setSelectedFolder(tempSearchText);
    }

    return (
        <>
            <Modal
                open={props.open}
                onClose={props.close}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={ModalStyles.modalStyle(colorPalette.background)}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Move to folder
                        </Typography>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={props.close} />
                        </IconButton>
                    </Box>

                    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Select
                            onChange={handleDropdownChange}
                            sx={InputStyles.muiSelectStyle}
                            style={{ width: '100%' }}
                            value={selectedFolder}
                            size='small'
                        >
                            <MenuItem value={'0'}>Select a folder</MenuItem>
                            {folderState.map((folder: any) => {
                                return (<MenuItem key={folder.id} value={folder.id}>{folder.name}</MenuItem>)
                            })}
                        </Select>
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button
                            style={{ width: 'fit-content', marginRight: '15px' }}
                            sx={ButtonStyles.outlinedButton}
                            onClick={props.close}
                            variant="contained"
                        >Cancel</Button>
                        <LoadingButton
                            style={{ width: 'fit-content' }}
                            onClick={handleFolderChange}
                            loading={loading}
                            sx={ButtonStyles.containedButton}
                            variant="contained">
                            Move to folder
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default ChangeFolderModal