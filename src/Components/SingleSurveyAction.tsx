import { Box, Typography } from '@mui/material'
import axios from 'axios'
import React, { useRef } from 'react'
import { disableSurvey, enableSurvey, shareSurvey } from '../Utils/Endpoints'
import Notification from '../Utils/Notification'
import CustomAlert from './CustomAlert'
import FSLoader from './FSLoader'

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

  const [ loading , setLoading] = React.useState(false);

    const snackbarRef: any = useRef(null);


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
            try {
                setLoading(true);
                let { data } = await axios.post(disableSurvey(props?.survey?.id));
                setLoading(false);
                if (data.statusCode !== 200) {                
                    snackbarRef?.current?.show(data.message, 'error');
                    return;
                }
                snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
                surveyData.is_published = 0;
            } catch (error) {
                setLoading(false);
                snackbarRef?.current?.show('Something went wrong', 'error');
            }
        } else {
            try {
                setLoading(true);
                let { data } = await axios.post(enableSurvey(props?.survey?.id));
                setLoading(false);
                if (data.statusCode !== 200) {
                    snackbarRef?.current?.show(data.message, 'error');
                    return;
                }
                snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
                if(data.success === true){
                    surveyData.is_published = 1;
                }
            } catch (error) {
                setLoading(false);
                snackbarRef?.current?.show('Something went wrong', 'error');
            }
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
                        // onMouseEnter={highlightTextBackGround}
                        // onMouseLeave={unhighlightTextBackGround}
                        sx={{ color: '#f1f1f1', padding: '5px', cursor : 'not-allowed' }} >
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
          <Notification ref={snackbarRef} />
          <FSLoader show={loading} />

        </>
    )
}

export default SingleSurveyAction