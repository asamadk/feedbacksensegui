import React, { useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ModalStyles from '../Styles/ModalStyle'
import * as ButtonStyles from '../Styles/ButtonStyle'
import LoadingButton from '@mui/lab/LoadingButton';
import * as Endpoints from '../Utils/Endpoints';
import { Button, IconButton, Modal, TextField, Typography, styled } from '@mui/material'
import { Box } from '@mui/system'
import axios from 'axios';
import Notification from '../Utils/Notification';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useNavigate } from 'react-router';

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

function CreateSurveyModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [showScratch, setShowScratch] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [surveyName, setSurveyName] = useState<string>('');

    const handleCreateSurvey = async () => {
        try {
            if (surveyName == null || surveyName === '') {
                snackbarRef?.current?.show('Please select a survey name to create survey.', 'error');
                return;
            }
            setLoading(true);
            let { data } = await axios.post(Endpoints.createSurvey(surveyName), {}, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data.message, 'success');
            setSurveyName('');
            setShowScratch(false);
            props.surveys.push(data.data);
            props.update();
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleClose = () => {
        setSurveyName('');
        setShowScratch(false);
        setLoading(false);
        props.close();
    }

    const selectCreateFromScratch = () => {
        setShowScratch(true);
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
                        <Typography fontFamily={'Apercu Pro'} id="modal-modal-title" variant="h5" component="h2">
                            Create a new survey
                        </Typography>
                        <IconButton sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    {
                        showScratch === true ?
                            <>
                                <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <CssTextField
                                        size='small'
                                        sx={{ input: { color: 'white' } }}
                                        id="outlined-basic"
                                        placeholder='Survey name'
                                        value={surveyName}
                                        variant="outlined"
                                        style={{ width: '100%' }}
                                        onChange={(e: any) => setSurveyName(e.target.value)}
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
                                        onClick={handleCreateSurvey}
                                        loading={loading}
                                        sx={ButtonStyles.containedButton}
                                        variant="contained">
                                        <span>
                                            Create
                                        </span>
                                    </LoadingButton>
                                </Box>
                            </> :
                            <CreateSurveyDefaultScreen create={selectCreateFromScratch} />
                    }
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateSurveyModal

function CreateSurveyDefaultScreen(props: any) {

    const navigate = useNavigate();

    return (
        <Box marginTop={'20px'} marginBottom={'20px'} display={'flex'} justifyContent={'space-around'}>
            <Box>
                <IconButton onClick={props.create} sx={{ borderRadius: '10px', marginBottom: '10px' }}>
                    <ReceiptIcon sx={{ fontSize: '150px' }} />
                </IconButton>
                <Typography textAlign={'center'} >Start from scratch</Typography>
            </Box>
            <Box>
                <IconButton onClick={() => navigate('/template')} sx={{ borderRadius: '10px', marginBottom: '10px' }}>
                    <PostAddIcon sx={{ fontSize: '150px' }} />
                </IconButton>
                <Typography textAlign={'center'} >Start from template</Typography>
            </Box>
        </Box>
    )
}