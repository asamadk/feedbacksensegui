import { Box, Button, Divider, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useRef, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import Notification from '../../Utils/Notification';
import FSLoader from '../FSLoader';
import { USER_UNAUTH_TEXT, colorPalette } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import axios from 'axios';
import { createSurveyFromTemplateAPI } from '../../Utils/Endpoints';
import { updateCurrentWorkflow } from '../../Redux/Actions/currentWorkflowActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import CreateSurveyModal from '../../Modals/CreateSurveyModal';

function TemplateDetailLeftPanel({
  template
}: { template: any }) {

  let navigation = useNavigate();

  const snackbarRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<any>();
  const [openCreateSurvey , setOpenCreateSurvey] = useState(false);

  const handleBackButtonClick = () => {
    window.history.back();
  }

  const handleCreateSurveyFromTemplate = async () => {
    try {
      const templateId = template.id;
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
      height={'100vh'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'space-between'}
      padding={'0px 20px'}
    >
      <Box>
        <Box textAlign={'start'}>
          <IconButton sx={{ marginTop: '10px' }} onClick={handleBackButtonClick}  >
            <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
          </IconButton>
        </Box>
        <Typography sx={{ textAlign: 'start' }} fontSize={24} color={colorPalette.darkBackground}>
          {template?.name}
        </Typography>
        <Typography sx={{ textAlign: 'start' }} color={colorPalette.fsGray} >
          {template?.description}
        </Typography>
      </Box>
      <Box marginBottom={'20px'} >
        <Box >
          <Button variant='contained' onClick={handleCreateSurveyFromTemplate} sx={containedButton} >
            Use this template
          </Button>
        </Box>
      </Box>
      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>

  )
}

export default TemplateDetailLeftPanel