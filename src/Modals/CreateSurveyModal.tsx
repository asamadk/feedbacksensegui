import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';
import * as ModalStyles from '../Styles/ModalStyle'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import PollIcon from '@mui/icons-material/Poll';
import * as Endpoints from '../Utils/Endpoints';
import { Button, IconButton, MenuItem, Modal, Select, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/system'
import axios from 'axios';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';

const typeContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    padding: '25px 10px',
    marginBottom: '10px',
    cursor: 'pointer'
}

function CreateSurveyModal(props: any) {

    const snackbarRef: any = useRef(null);

    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);
    const [selectedSurveyType, setSelectedSurveyType] = useState('');
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        init();
        getSurveyType();
    }, []);

    const init = () => {
        setSelectedSurveyType('');
    }

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
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        }
    }

    const highlightTextBackGround = (e: any) => {
        e.target.style.color = '#FFA500';
    }

    const unhighlightTextBackGround = (e: any) => {
        e.target.style.color = '#f1f1f1';
    }

    const handleSurveyTypeClick = (surveyTypeId: string) => {
        setSelectedSurveyType(surveyTypeId);
    }

    const handleCreateSurvey = async () => {
        try {
            if(selectedSurveyType == null || selectedSurveyType === ''){
                snackbarRef?.current?.show('Please select a survey type to create survey.', 'error');
                return;
            }
            setLoading(true);
            let { data } = await axios.post(Endpoints.createSurvey(selectedSurveyType),{}, { withCredentials: true });
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
        }
    }

    const handleClose = () => {
        setSelectedSurveyType('');
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
                            Create a new survey
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
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
                                            <Typography sx={{ paddingLeft: '5px' }} >{surveyType.label}</Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '14px' }} color={'#454545'} >Run targeted surveys on websites or inside products</Typography>
                                        {selectedSurveyType === surveyType.id && <Box><CheckCircleIcon sx={{ color: '#FFA500', position: 'absolute', right: '20px' }} /></Box>}
                                    </Box>
                                )
                            })
                        }
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={handleClose} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} onClick={handleCreateSurvey} sx={ButtonStyles.containedButton} variant="contained">Create</Button>
                    </Box>
                </Box>
            </Modal>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default CreateSurveyModal