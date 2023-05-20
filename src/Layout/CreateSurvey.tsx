import { Alert, Box, Button, IconButton, Snackbar, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import FeedbackCanvas from '../FlowComponents/FeedbackCanvas'
import 'reactflow/dist/style.css';
import FeedbackComponentList from '../FlowComponents/FeedbackComponentList'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'
import * as Endpoints from '../Utils/Endpoints';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import DynamicComponentModal from '../FlowComponents/DynamicComponentModal';
import { useParams } from 'react-router';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Notification from '../Utils/Notification';
import FSLoader from '../Components/FSLoader';
import { enableSurvey } from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { genericModalData } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FFA500',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFA500',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#454545',
    },
    '&:hover fieldset': {
      borderColor: '#FFA500',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFA500',
    },
  },
  color: 'white'
});

function CreateSurvey(props: any) {
  const snackbarRef: any = useRef(null);

  const { surveyId } = useParams();
  const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
  const [showGenericModal, setShowGenericModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [componentId, setComponentId] = React.useState<string>();
  const [comUiId, setCompUiId] = React.useState<string>('');
  const [surveyFlow, setSurveyFlow] = React.useState<any>();
  const [componentConfig, setComponentConfig] = React.useState<Map<string, object>>(new Map());
  const [surveyDetail, setSurveyDetail] = React.useState<any>();
  const [showSurveyName, setShowSurveyName] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [saveFlowTemp, setSaveFlowTemp] = React.useState();
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    getSingleSurvey();
  }, [])

  const getSingleSurvey = async () => {
    try {
      setLoading(true);
      let { data } = await axios.get(Endpoints.getSurveyDetails(surveyId), { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      if (data != null) {
        setSurveyDetail(data.data);
        if (data?.data?.workflows != null && data?.data.workflows.length > 0) {
          setSurveyFlow(data?.data?.workflows[0]);
        }
        props.updateSurveyId(data.data.id)
      }
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.statusCode, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        FeedbackUtils.handleLogout();
      }
    }
  }

  const handleComponentEditClick = (uId: string, compId: string) => {
    setComponentId(compId);
    setCompUiId(uId);
    setOpenEditModal(true);
  }

  const handleSaveComponentConfig = (data: any) => {
    let tempMap = componentConfig;
    if (componentId == null) {
      snackbarRef?.current?.show('A component error has been occurred.', 'error');
      return;
    }
    const validatedComp = FeedbackUtils.validateFlowComponent(JSON.parse(data), parseInt(componentId));
    if (validatedComp !== null) {
      snackbarRef?.current?.show(validatedComp, 'error');
      return;
    }
    tempMap?.set(comUiId, data);
    setComponentConfig(tempMap);
    setOpenEditModal(false);
    snackbarRef?.current?.show('Saved.', 'success');
  }

  const checkSurveyResponse = async (): Promise<boolean> => {
    try {
      setLoading(true);
      if (surveyId == null) { return false; }
      const { data } = await axios.get(Endpoints.checkBeforeSaveSurveyFlow(surveyId), { withCredentials: true });
      setLoading(false);
      return data?.data?.alreadyHasResponse;
    } catch (error) {
      setLoading(false);
      return true;
    }
  }

  const handleSurveyResetModal = () => {
    setShowGenericModal(true);
    let genDeleteObj: genericModalData = {
      header: 'Do you really want to save this survey?',
      warning: 'Warning: Changes will delete previous responses',
      successButtonText: 'Save anyway',
      cancelButtonText: 'Cancel',
      description: 'Making changes to a survey that has already received responses will result in the deletion of all previous responses. Are you sure you want to proceed?',
      type: 'save_survey'
    }
    setGenericModalObj(genDeleteObj);
  }

  const handleSuccessGenericButtonClick = () => {
    setShowGenericModal(false);
    if (genericModalObj?.type !== 'save_survey') {
      return;
    }
    saveFlow(saveFlowTemp,true);
  }

  const handleSaveFlow = async (flow: any) => {
    try {
      const isSurveyAlreadyFilled = await checkSurveyResponse();
      if (isSurveyAlreadyFilled === true) {
        setSaveFlowTemp(flow);
        handleSurveyResetModal();
        return;
      }

      if (flow == null || flow.length < 1) { return; }
      if (componentConfig.size < 1) {
        saveFlow(flow,false);
        return;
      }
      for (const key in flow) {
        if (key.toLowerCase() !== 'nodes') {
          continue;
        }
        let nodeList: any[] = flow[key];
        nodeList.forEach(n => {
          if (componentConfig.has(n.id)) {
            n.data.compConfig = componentConfig.get(n.id);
          }
        });
      }
      saveFlow(flow,false);
    } catch (error) {
      console.log('Exception :: handleSaveFlow :: ', error);
      snackbarRef?.current?.show('Something went wrong.', 'error');
    }

  }

  const validateSurveyFlowOnSave = (flow: any): boolean => {
    try {
      const nodes: any[] = flow?.nodes;
      for (const node of nodes) {
        if (node == null || node.data == null) {
          continue;
        }
        if (node?.data?.compConfig == null) {
          snackbarRef?.current?.show('One or more components are have missing information.', 'error');
          return false;
        }
        const validatedComp = FeedbackUtils.validateFlowComponent(JSON.parse(node?.data?.compConfig), node.data.compId);
        if (validatedComp != null) {
          snackbarRef?.current?.show(validatedComp, 'error');
          return false;
        }
      }
      return true;
    } catch (error) {
      console.log("🚀 ~ file: CreateSurvey.tsx:146 ~ validateSurveyFlowOnSave ~ error:", error)
      return false;
    }
  }

  const saveFlow = async (flow: any,deleteResponse : boolean) => {
    try {
      setLoading(true);
      const isSurveyFlowValid = validateSurveyFlowOnSave(flow);
      const isNodeDisconnected = FeedbackUtils.validateIsNodeDisconnected(flow);
      if (isNodeDisconnected === true) {
        setLoading(false);
        snackbarRef?.current?.show('Please make sure all components are connected.', 'error');
        return;
      }
      if (isSurveyFlowValid === false) {
        setLoading(false);
        return;
      }
      if (surveyId == null) {
        return;
      }
      const { data } = await axios.post(Endpoints.saveSurveyFlow(surveyId,deleteResponse), flow, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      snackbarRef?.current?.show(data?.message, 'success');
    } catch (error: any) {
      setLoading(false)
      snackbarRef?.current?.show(error?.response?.data?.statusCode, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        FeedbackUtils.handleLogout();
      }
    }
  }

  const handleEditNameClick = () => {
    setShowSurveyName(false);
  }

  const handleCloseEditName = () => {
    setShowSurveyName(true);
  }

  const handleSaveNameClick = async () => {
    try {
      const payload = {
        surveyName: surveyDetail?.name
      }
      setLoading(true);
      const { data } = await axios.post(Endpoints.updateSurveyName(surveyDetail?.id), payload, { withCredentials: true })
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      snackbarRef?.current?.show(data?.message, 'success');
      handleCloseEditName();
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.statusCode, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        FeedbackUtils.handleLogout();
      }
    }
  }

  const handleFlowNameChange = (e: any) => {
    let tempSurveyDetail = JSON.parse(JSON.stringify(surveyDetail));
    tempSurveyDetail.name = e.target.value;
    setSurveyDetail(tempSurveyDetail);
  }

  const handleDisableEnableSurvey = async (e: any) => {
    if (surveyDetail?.is_published === true) {
      try {
        setLoading(true);
        let { data } = await axios.post(Endpoints.disableSurvey(surveyDetail?.id), {}, { withCredentials: true });
        setLoading(false);
        if (data.statusCode !== 200) {
          snackbarRef?.current?.show(data?.message, 'error');
          return;
        }
        snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
        const tempSurveyDetail = JSON.parse(JSON.stringify(surveyDetail));
        tempSurveyDetail.is_published = false;
        setSurveyDetail(tempSurveyDetail);
      } catch (error: any) {
        setLoading(false);
        snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
          FeedbackUtils.handleLogout();
        }
      }
    } else {
      try {
        setLoading(true);
        let { data } = await axios.post(enableSurvey(surveyDetail?.id), {}, { withCredentials: true });
        setLoading(false);
        if (data.statusCode !== 200) {
          snackbarRef?.current?.show(data.message, 'error');
          return;
        }
        snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
        if (data.success === true) {
          const tempSurveyDetail = JSON.parse(JSON.stringify(surveyDetail));
          tempSurveyDetail.is_published = true;
          setSurveyDetail(tempSurveyDetail);
        }
      } catch (error: any) {
        setLoading(false);
        snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
          FeedbackUtils.handleLogout();
        }
      }
    }
    props.close();
  }


  return (
    <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)' }} >
      <Box sx={LayoutStyles.localSurveyNavbar} >
        <Box display={'flex'} >
          {showSurveyName &&
            <Typography
              style={{ position: 'relative', top: '15px', paddingLeft: '20px', cursor: 'pointer', fontSize: '17px' }}
              color={'#f1f1f1'} >
              {surveyDetail?.name}
            </Typography>
          }
          {showSurveyName &&
            <IconButton onClick={handleEditNameClick} size='small' sx={iconStyle} >
              <ModeEditOutlineOutlinedIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>}
          {showSurveyName === false &&
            <CssTextField
              sx={{ input: { color: 'white' } }}
              id="outlined-basic"
              value={surveyDetail?.name}
              variant="outlined"
              size='small'
              onChange={(e) => handleFlowNameChange(e)}
              style={{ width: '300px', paddingTop: '5px', paddingLeft: '10px' }}
            />
          }
          {
            showSurveyName === false &&
            <IconButton onClick={handleSaveNameClick} size='small' sx={iconStyle} >
              <SaveAltIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>
          }
          {
            showSurveyName === false &&
            <IconButton onClick={handleCloseEditName} size='small' sx={iconStyle} >
              <CloseIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>
          }
        </Box>
        <Button onClick={handleDisableEnableSurvey} style={{ width: '110px' }} sx={ButtonStyles.containedButton} variant="contained">
          {surveyDetail?.is_published === true ? 'Disable' : 'Enable'}
        </Button>
      </Box>
      <Box display={'flex'} >
        <Box width={'77%'} >
          <FeedbackCanvas
            flow={surveyFlow}
            surveyDetail={surveyDetail}
            onEdit={handleComponentEditClick}
            performSave={handleSaveFlow}
          />
        </Box>
        <Box sx={{ borderLeft: '1px #454545 solid', overflowY: 'scroll', height: 'calc(100vh - 130px)' }} width={'23%'} >
          <FeedbackComponentList />
        </Box>
      </Box>

      <DynamicComponentModal
        close={() => setOpenEditModal(false)}
        open={openEditModal}
        uiId={comUiId}
        compId={componentId}
        save={handleSaveComponentConfig}
        flow={surveyFlow}
        theme={surveyDetail?.survey_design_json}
      />

      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
      <GenericModal
        payload={genericModalObj}
        close={() => setShowGenericModal(false)}
        open={showGenericModal}
        callback={handleSuccessGenericButtonClick}
      />
    </Box>
  )
}

export default CreateSurvey

const iconStyle = {
  marginTop: '5px',
  padding: '10px',
  paddingTop: '10px',
  paddingLeft: '10px'
}