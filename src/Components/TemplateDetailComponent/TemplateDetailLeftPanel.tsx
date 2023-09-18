import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useRef, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import { USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { createSurveyFromTemplateAPI } from '../../Utils/Endpoints';
import { updateCurrentWorkflow } from '../../Redux/Actions/currentWorkflowActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

function TemplateDetailLeftPanel({
  template
}: { template: any }) {

  let navigation = useNavigate();

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<any>();


  const handleBackButtonClick = () => {
    window.history.back();
  }

  const handleCreateSurveyFromTemplate = async () => {
    try {
      const templateId = template.id;
      console.log("🚀 ~ file: TemplateDetailLeftPanel.tsx:16 ~ handleCreateSurveyFromTemplate ~ templateId:", templateId)
      setLoading(true);
      const url = createSurveyFromTemplateAPI(templateId);
      const { data } = await axios.post(url, {}, { withCredentials: true });
      setLoading(false);
      if (data?.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      snackbarRef?.current?.show(data?.message, 'success');
      const surveyId = data?.data?.surveyId;
      handleOpenSurvey(surveyId);
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      setLoading(false);
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        handleLogout();
      }
    }
  }

  const handleOpenSurvey = (surveyId: any) => {
    if(surveyId == null){
      snackbarRef?.current?.show('Cannot create survey.', 'error');
    }
    dispatch(updateCurrentWorkflow(surveyId));
    navigation(`/survey/detail/create/${surveyId}`);
  }

  return (
    <Box
      height={'calc(100vh - 62px)'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      padding={'0px 20px'}
      borderRight={'1px #454545 solid'}
    >
      <Box>
        <Box textAlign={'start'}>
          <IconButton sx={{ marginTop: '10px' }} onClick={handleBackButtonClick}  >
            <ArrowBackIcon sx={{ color: '#f1f1f1' }} />
          </IconButton>
        </Box>
        <Typography sx={{ textAlign: 'start' }} fontSize={24} color={'white'}>
          {template?.name}
        </Typography>
        <Typography sx={{ textAlign: 'start' }} color={'#808080'} >
          {template?.description}
        </Typography>
      </Box>
      <Box marginBottom={'20px'} >
        <Box marginBottom={'30px'} >
          <Button variant='contained' onClick={handleCreateSurveyFromTemplate} sx={containedButton} >
            Use this template
          </Button>
        </Box>
        <Divider sx={{ marginBottom: '10px' }} />
        <Typography color={'#808080'} >Got your own survey idea ?</Typography>
        <Button variant='outlined' sx={outlinedButton} >
          Start from scratch
        </Button>
      </Box>
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>

  )
}

export default TemplateDetailLeftPanel