import { Box, Button, IconButton, InputLabel, Modal, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as ModalStyles from '../Styles/ModalStyle'
import CloseIcon from '@mui/icons-material/Close';
import { colorPalette, joyrideConstants, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { createFolder } from '../Utils/Endpoints';
import axios from 'axios';
import Notification from '../Utils/Notification';
import { LoadingButton } from '@mui/lab';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';
import { textFieldStyle } from '../Styles/InputStyles';
import { joyrideState } from '../Utils/types';
import ReactJoyride, { ACTIONS, CallBackProps, STATUS } from 'react-joyride';

const CssTextField = styled(TextField)(textFieldStyle);

const textFieldStyleCSS = {
    paddingTop: '30px'
}

function CreateFolder(props: any) {

    const snackbarRef: any = useRef(null);
    const [folderName, setFolderName] = useState<string>('');
    const [loading, setLoading] = React.useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);

    const [{ run, steps, stepIndex }, setState] = useState<joyrideState>({
        run: false,
        stepIndex: 0,
        steps: [
            {
                content: 
                <>
                    <p>Give your workspace a name and click "Create".</p>
                </>,
                target: '.create-folder-input',
                disableBeacon: true,
                disableOverlayClose: true,
                hideCloseButton: true,
                hideFooter: true,
                placement: 'bottom',
                spotlightClicks: true,
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
        ],
    });

    useEffect(() => {
        handleJoyrideVisibility();
    }, [props?.open]);

    const handleJoyrideVisibility = () => {
        if(props.open === false ){
            setState({
                run: false,
                steps: steps,
                stepIndex: 0,
            });
            return;
        }
        const hasSeenJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_2);
        if (!hasSeenJoyride) {
            setState({
                run: true,
                steps: steps,
                stepIndex: 0,
            });
            localStorage.setItem(joyrideConstants.JOYRIDE_2, 'true');
        }
    }

    const handleCreateButtonClick = async () => {
        try {
            if (folderName == null || folderName.length < 1) {
                snackbarRef?.current?.show('Please give workspace a name', 'error');
                return;
            }
            if(folderName.length > 80){
                snackbarRef?.current?.show('Workspace name too long!', 'error');
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

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;
        // const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps, stepIndex: 0, });
        }
    };

    return (
        <>
            <ReactJoyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={run}
                scrollToFirstStep
                // showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                    buttonNext: {
                        backgroundColor: colorPalette.primary
                    },
                    buttonBack: {
                        color: colorPalette.primary
                    }
                }}
            />
            <Modal
                open={props.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className='create-folder-input' sx={{...ModalStyles.modalStyle(colorPalette?.background),width : '30%'}}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Create folder
                        </Typography>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>
                    <Box className="create-folder-modal" sx={textFieldStyleCSS} >
                        <InputLabel 
                            style={{ color: colorPalette.fsGray, paddingBottom: '3px',fontSize : '13px' }} 
                            htmlFor="component-simple"
                        >
                            Name your folder
                        </InputLabel>
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