import React, { useEffect, useState } from 'react'
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

const typeContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    padding: '25px 10px',
    marginBottom: '10px',
    cursor: 'pointer'
}

function CreateSurveyModal(props: any) {

    const [surveyTypes, setSurveyTypes] = useState<any[]>([]);
    const [selectedSurveyType, setSelectedSurveyType] = useState('');

    useEffect(() => {
        init();
        getSurveyType();
    }, []);

    const init = () => {
        setSelectedSurveyType('');
    }

    const getSurveyType = async () => {
        let { data } = await axios.get(Endpoints.getSurveyTypes());
        const isValidated = FeedbackUtils.validateAPIResponse(data);
        if (isValidated === false) {
            return;
        }

        if (data.data != null) {
            data.data.unshift({
                id: '0',
                label: 'All survey type'
            });
            setSurveyTypes(data.data);
        }
    }

    const highlightTextBackGround = (e: any) => {
        e.target.style.color = '#FFA500';
    }

    const unhighlightTextBackGround = (e: any) => {
        e.target.style.color = '#f1f1f1';
    }

    const handleSurveyTypeClick = (surveyTypeId : string) => {
        setSelectedSurveyType(surveyTypeId);
    }

    const handleCreateSurvey = async () => {
        let { data } = await axios.post(Endpoints.createSurvey(selectedSurveyType));
        let isValidated = FeedbackUtils.validateAPIResponse(data);

        if(isValidated === false){
            return;
        }

        console.log('Survey create = ', data);

        props.surveys.push(data.data);
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
                <Box sx={ModalStyles.modalStyle}>
                    <Box sx={ModalStyles.modalHeaderStyle} >
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            Create a new survey
                        </Typography>
                        <IconButton color='warning' sx={{ color: '#f1f1f1' }} >
                            <CloseIcon onClick={props.close} />
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
                                        {selectedSurveyType === surveyType.id && <Box><CheckCircleIcon sx={{color : '#FFA500', position : 'absolute', right : '20px'}} /></Box>}
                                    </Box>
                                )
                            })
                        }
                    </Box>

                    <Box sx={ModalStyles.modalButtonContainerStyle} >
                        <Button style={{ width: 'fit-content', marginRight: '15px' }} sx={ButtonStyles.outlinedButton} onClick={props.close} variant="contained">Cancel</Button>
                        <Button style={{ width: 'fit-content' }} onClick={handleCreateSurvey} sx={ButtonStyles.containedButton} variant="contained">Create</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default CreateSurveyModal