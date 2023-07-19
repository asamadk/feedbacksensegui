import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ModalStyles from '../Styles/ModalStyle'
import * as ButtonStyles from '../Styles/ButtonStyle'
import LoadingButton from '@mui/lab/LoadingButton';
import PollIcon from '@mui/icons-material/Poll';
import * as Endpoints from '../Utils/Endpoints';
import { Button, IconButton, Modal, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/system'
import axios from 'axios';
import Notification from '../Utils/Notification';
import { useNavigate } from 'react-router';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';

const typeContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    padding: '25px 10px',
    marginBottom: '10px',
    cursor: 'pointer'
}

function CreateSurveyModal(props: any) {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);
    const [selectedSurveyType, setSelectedSurveyType] = useState('');
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        getSurveyType();
    }, []);

    const getSurveyType = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getSurveyTypes(), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data.message, 'error');
                return;
            }
            if (data.data != null) {
                setSurveyTypes(data.data);
            }
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const highlightTextBackGround = (e: any) => {
        e.target.style.color = '#006DFF';
    }

    const unhighlightTextBackGround = (e: any) => {
        e.target.style.color = '#f1f1f1';
    }

    const handleSurveyTypeClick = (surveyTypeId: string) => {
        setSelectedSurveyType(surveyTypeId);
    }

    const handleCreateSurvey = async () => {
        try {
            if (selectedSurveyType == null || selectedSurveyType === '') {
                snackbarRef?.current?.show('Please select a survey type to create survey.', 'error');
                return;
            }
            setLoading(true);
            let { data } = await axios.post(Endpoints.createSurvey(selectedSurveyType), {}, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data.message, 'success');
            props.surveys.push(data.data);
            setSelectedSurveyType('');
            props.update();
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleClose = () => {
        setSelectedSurveyType('');
        setLoading(false);
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
                        <Typography fontFamily={'Apercu Pro'}  id="modal-modal-title" variant="h5" component="h2">
                            Create a new survey
                        </Typography>
                        <IconButton color='info' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={handleClose} />
                        </IconButton>
                    </Box>

                    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
                        {
                            surveyTypes.map(surveyType => {
                                return (
                                    <Box
                                        onClick={() => handleSurveyTypeClick(surveyType.id)}
                                        onMouseEnter={highlightTextBackGround}
                                        onMouseLeave={unhighlightTextBackGround}
                                        sx={typeContainer}
                                        key={surveyType.id}
                                    >
                                        <Box display={'flex'} >
                                            <PollIcon />
                                            <Typography fontFamily={'Apercu Pro'} sx={{ paddingLeft: '5px' }} >{surveyType.label}</Typography>
                                        </Box>
                                        <Typography fontFamily={'Apercu Pro'} sx={{ fontSize: '14px' }} color={'#454545'} >Run targeted surveys on websites or inside products</Typography>
                                        {selectedSurveyType === surveyType.id && <Box><CheckCircleIcon sx={{ color: '#006DFF', position: 'absolute', right: '20px' }} /></Box>}
                                    </Box>
                                )
                            })
                        }
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
                </Box>
            </Modal>
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateSurveyModal