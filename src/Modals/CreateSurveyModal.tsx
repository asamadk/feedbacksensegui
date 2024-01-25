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
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { handleLogout } from '../Utils/FeedbackUtils';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { textFieldStyle } from '../Styles/InputStyles';

const CssTextField = styled(TextField)(textFieldStyle);

function CreateSurveyModal(props: any) {

    const snackbarRef: any = useRef(null);
    const [showScratch, setShowScratch] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [surveyName, setSurveyName] = useState<string>('');
    const defaultColor = useSelector((state: any) => state.colorReducer);

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
            // props.surveys.push(data.data);
            props.update();
        } catch (error: any) {
            console.log("🚀 ~ file: CreateSurveyModal.tsx:66 ~ handleCreateSurvey ~ error:", error)
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
                <Box sx={ModalStyles.modalStyle(defaultColor?.secondaryColor)}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography fontFamily={'Apercu Pro'} id="modal-modal-title" variant="h5" component="h2">
                            Create a new survey
                        </Typography>
                        <IconButton sx={{ color: colorPalette.darkBackground }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    {
                        showScratch === true ?
                            <>
                                <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <CssTextField
                                        size='small'
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
            <Box onClick={props.create} sx={selectorBackground} >
                <ReceiptIcon sx={{ fontSize: '150px', color: colorPalette.primary, marginBottom: '10px' }} />
                <Typography textAlign={'center'} color={colorPalette.primary} >Start from scratch</Typography>
            </Box>
            <Box onClick={() => navigate('/template')} sx={selectorBackground} >
                <PostAddIcon sx={{ fontSize: '150px', color: colorPalette.primary, marginBottom: '10px' }} />
                <Typography textAlign={'center'} color={colorPalette.primary} >Start from template</Typography>
            </Box>
        </Box>
    )
}

const selectorBackground = {
    background: colorPalette.background,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    padding: '10px',
    borderRadius: '6px',
    width: '45%',
    textAlign: 'center',
    cursor: 'pointer'
}