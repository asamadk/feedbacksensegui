import { Box, Typography } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { disableSurvey, enableSurvey, shareSurvey } from '../Utils/Endpoints'
import CustomAlert from './CustomAlert'

const surveyActionContainer = {
    position: 'absolute',
    zIndex: 10,
    backgroundColor: '#121212',
    border: '1px #454545 solid',
    borderRadius: '5px',
    textAlign: 'start',
    padding: '5px',
    width: '130px'
}

function SingleSurveyAction(props: any) {

    const highlightTextBackGround = (e: any) => {
        e.target.style.borderRadius = '5px'
        e.target.style.backgroundColor = '#454545';
    }

    const unhighlightTextBackGround = (e: any) => {
        e.target.style.backgroundColor = '#121212';
    }

    const handleDisableEnableSurvey = async (e: any) => {
        let surveyData = props?.survey;
        if (surveyData == null) {
            <CustomAlert open={true} message={'Something went wrong'} type={'error'} />
        }

        if (props?.survey?.is_published === 1) {
            let { data } = await axios.post(disableSurvey(props?.survey?.id));
            if (data.statusCode !== 200) {
                //TODO something went wrong 
                return;
            }
            surveyData.is_published = 0;
        } else {
            let { data } = await axios.post(enableSurvey(props?.survey?.id));
            if (data.statusCode !== 200) {
                //TODO something went wrong 
                return;
            }
            surveyData.is_published = 1;
        }
        props.close();
    }

    const handleShareSurvey = () => {
        let surveyData = props?.survey;
        let shareSurveyLink = shareSurvey(surveyData.id);
        navigator.clipboard.writeText(shareSurveyLink);
        //TODO show alert
        props.close();
    }

    return (
        <>
            {props.open &&
                <Box sx={surveyActionContainer} >
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        onClick={handleDisableEnableSurvey}
                        sx={{ color: '#f1f1f1', padding: '5px' }} >
                        {props?.survey?.is_published === 1 ? 'Disable' : 'Enable'}
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} 
                        onClick={handleShareSurvey}
                        >
                        Share
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }} >
                        Duplicate
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px' }}
                        onClick={props.changeFolder}
                    >
                        Move to folder
                    </Typography>
                    <Typography
                        onMouseEnter={highlightTextBackGround}
                        onMouseLeave={unhighlightTextBackGround}
                        onClick={() => props.delete(props?.survey?.id)}
                        sx={{ color: '#D81159', padding: '5px' }}
                    >
                        Delete
                    </Typography>
                </Box>
            }
        </>
    )
}

export default SingleSurveyAction