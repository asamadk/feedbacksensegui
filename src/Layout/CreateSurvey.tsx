import { Box, Button, IconButton, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import FeedbackCanvas from '../FlowComponents/FeedbackCanvas'
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'reactflow/dist/style.css';
import FeedbackComponentList from '../FlowComponents/FeedbackComponentList'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'
import * as Endpoints from '../Utils/Endpoints';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import DynamicComponentModal from '../FlowComponents/DynamicComponentModal';
import { useNavigate, useParams } from 'react-router';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import axios from 'axios';
import Notification from '../Utils/Notification';
import FSLoader from '../Components/FSLoader';
import { enableSurvey } from '../Utils/Endpoints';
import { componentName, USER_UNAUTH_TEXT } from '../Utils/Constants';
import { genericModalData, surveyFlowType, userRoleType } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { updateWorkflowDirty } from '../Redux/Actions/workflowDirtyActions';
import { useDispatch } from 'react-redux';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { updateWorkflowCheck } from '../Redux/Actions/workflowCheckActions';
import WorkflowMore from '../FlowComponents/WorkflowMore';
import SurveyLogsModal from '../Modals/SurveyLogsModal';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';

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

function CreateSurvey(props: any) {

  const snackbarRef: any = useRef(null);
  const navigate = useNavigate();
  const childRef = useRef<any>(null);

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
  const [saveFlowTemp, setSaveFlowTemp] = React.useState<any>();
  const [isWorkflowPublished, setIsWorkflowPublished] = useState(false);
  const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);
  const workflowCheck = useSelector((state: any) => state.workflowCheck);
  const workflowDirty = useSelector((state: any) => state.workflowDirty);
  const defaultColor = useSelector((state: any) => state.colorReducer);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userRole: userRoleType = useSelector((state: any) => state.userRole);
  const [openSurveyLogs, setOpenSurveyLogs] = useState(false);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    getSingleSurvey();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
          const tempSurveyFlow = data?.data;
          setIsWorkflowPublished(tempSurveyFlow?.is_published);
          setSurveyFlow(data?.data?.workflows[0]);
          populateComponentConfig(data?.data?.workflows[0]);
        }
      }
    } catch (error: any) {
      snackbarRef?.current?.show(error?.response?.data?.statusCode, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        FeedbackUtils.handleLogout();
      }
    }
  }

  const populateComponentConfig = (flow: any) => {
    if (flow == null || flow.json == null) { return; }
    const flowMap: surveyFlowType = JSON.parse(flow.json);
    const compConfMap = new Map<string, object>();
    flowMap?.nodes?.forEach((node) => {
      const compConfig = FeedbackUtils.getComponentConfigFromNode(node);
      compConfig.existing = true;
      const compUiId = node?.id;
      compConfMap.set(compUiId, compConfig);
    });
    setComponentConfig(compConfMap);
  }

  const handleComponentEditClick = (uId: string, compId: string) => {
    setComponentId(compId);
    setCompUiId(uId);
    setOpenEditModal(true);
  }

  const handleSaveComponentConfig = (data: any) => {
    if (isWorkflowPublished === true) {
      snackbarRef?.current?.show('Please disable workflow to edit.', 'error');
      return;
    }
    let tempMap = new Map(componentConfig);
    if (componentId == null) {
      snackbarRef?.current?.show('A component error has been occurred.', 'error');
      return;
    }
    const validatedComp = FeedbackUtils.validateFlowComponent(JSON.parse(data), parseInt(componentId));
    const validatedLogic = FeedbackUtils.validateComponentLogic(JSON.parse(data), null, parseInt(componentId), []);
    if (validatedComp != null) {
      snackbarRef?.current?.show(validatedComp, 'warning');
      // return;
    } else {
      if (validatedLogic != null) {
        snackbarRef?.current?.show(validatedLogic, 'warning');
        // return;
      }
    }

    const tempComponentData: any = tempMap.get(comUiId);
    const isComponentExisting: boolean | null = tempComponentData?.existing;
    if (isComponentExisting === true) {
      const tempData = JSON.parse(data);
      tempData.existing = true;
      data = JSON.stringify(tempData);
    } else {
      const tempData = JSON.parse(data);
      tempData.existing = false;
      data = JSON.stringify(tempData);
    }
    tempMap?.set(comUiId, JSON.parse(data));
    setComponentConfig(tempMap);
    setOpenEditModal(false);
    if (validatedComp == null && validatedLogic == null) {
      snackbarRef?.current?.show('Saved.', 'success');
    }
    const dataObj = JSON.parse(data);
    childRef?.current.createEdge(dataObj, comUiId, Array.from(tempMap.keys()));
    //If changes are done in new component then we do not check to delete survey responses.
    if (isComponentExisting === true) {
      checkWorkflow(true);
    }
    makeGlobalWorkflowDirty(true);
  }

  const checkWorkflow = (value: boolean) => {
    const tempWorkflowDirty: any = {};
    tempWorkflowDirty[currentWorkflowId] = value;
    dispatch(updateWorkflowCheck(tempWorkflowDirty));
  }

  const makeGlobalWorkflowDirty = (values: boolean) => {
    const tempWorkflowDirty: any = {};
    tempWorkflowDirty[currentWorkflowId] = values;
    dispatch(updateWorkflowDirty(tempWorkflowDirty));
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
    // if(genericModalObj?.type === 'workflow-check'){
    //   return;
    // }
    if (genericModalObj?.type !== 'save_survey') {
      return;
    }

    if (saveFlowTemp == null || saveFlowTemp?.length < 1) { return; }
    if (componentConfig.size < 1) {
      saveFlow(saveFlowTemp, true);
      return;
    }
    for (const key in saveFlowTemp) {
      if (key.toLowerCase() !== 'nodes') {
        continue;
      }
      let nodeList: any[] = saveFlowTemp[key];
      nodeList.forEach(n => {
        if (componentConfig.has(n.id)) {
          n.data.compConfig = JSON.stringify(componentConfig.get(n.id));
        }
      });
    }
    saveFlow(saveFlowTemp, true);
  }

  const handleSaveFlow = async (flow: any) => {
    try {
      const isSurveyAlreadyFilled = await checkSurveyResponse();
      if (isSurveyAlreadyFilled === true && workflowCheck[currentWorkflowId] === true) {
        setSaveFlowTemp(flow);
        handleSurveyResetModal();
        return;
      }

      if (flow == null || flow.length < 1) { return; }
      if (componentConfig.size < 1) {
        saveFlow(flow, false);
        return;
      }
      for (const key in flow) {
        if (key.toLowerCase() !== 'nodes') {
          continue;
        }
        let nodeList: any[] = flow[key];
        nodeList.forEach(n => {
          if (componentConfig.has(n.id)) {
            const compConfStr = componentConfig.get(n.id);
            if (compConfStr != null) {
              n.data.compConfig = JSON.stringify(compConfStr);
            }
          }
        });
      }
      saveFlow(flow, false);
    } catch (error) {
      snackbarRef?.current?.show('Something went wrong.', 'error');
    }
  }

  const saveFlow = async (flow: any, deleteResponse: boolean) => {
    try {
      if (isWorkflowPublished === true) {
        snackbarRef?.current?.show('Cannot save published surveys.', 'error');
        return;
      }
      setLoading(true);
      if (surveyId == null) {
        return;
      }
      const { data } = await axios.post(Endpoints.saveSurveyFlow(surveyId, deleteResponse), flow, { withCredentials: true });
      setLoading(false);
      if (data.statusCode !== 200) {
        snackbarRef?.current?.show(data?.message, 'error');
        return;
      }
      snackbarRef?.current?.show(data?.message, 'success');
      checkWorkflow(false);
      makeGlobalWorkflowDirty(false);
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

  const handleCloseEditName = (rerender: boolean) => {
    setShowSurveyName(true);
    if (rerender === true) {
      getSingleSurvey();
    }
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
      handleCloseEditName(false);
    } catch (error: any) {
      setLoading(false);
      snackbarRef?.current?.show(error?.response?.data?.message, 'error');
      if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
        FeedbackUtils.handleLogout();
      }
    }
  }

  const handleFlowNameChange = (e: any) => {
    setSurveyDetail((prevDetail: any) => ({ ...prevDetail, name: e.target.value }));
  }

  const handleDisableEnableSurvey = async (e: any) => {
    if (!CoreUtils.isComponentVisible(userRole, componentName.DISABLE_SURVEY)) {
      snackbarRef?.current?.show('Guests cannot publish/unpublish surveys', 'error');
      props.close();
      return;
    }
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
        setSurveyDetail((prevDetail: any) => ({ ...prevDetail, is_published: false }));
        setIsWorkflowPublished(false);
      } catch (error: any) {
        setLoading(false);
        snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
          FeedbackUtils.handleLogout();
        }
      }
    } else {
      try {
        const isWorkflowDirty = workflowDirty[currentWorkflowId];
        if (isWorkflowDirty === true) {
          showUnsavedWarning();
          return;
        }
        setLoading(true);
        let { data } = await axios.post(enableSurvey(surveyDetail?.id), {}, { withCredentials: true });
        setLoading(false);
        if (data.statusCode !== 200) {
          snackbarRef?.current?.show(data.message, 'error');
          return;
        }
        snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
        if (data.success === true) {
          setSurveyDetail((prevDetail: any) => ({ ...prevDetail, is_published: true }));
          setIsWorkflowPublished(true);
        }
      } catch (error: any) {
        setLoading(false);
        snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
          FeedbackUtils.handleLogout();
        }
      }
    }
  }

  const showPreview = () => {
    const isWorkflowDirty = workflowDirty[currentWorkflowId];
    if (isWorkflowDirty === true) {
      showUnsavedWarning();
      return;
    }
    window.open(`/share/survey/preview/${currentWorkflowId}`)
  }

  const showUnsavedWarning = () => {
    setShowGenericModal(true);
    let genDeleteObj: genericModalData = {
      header: 'You have some unsaved changes in workflow',
      warning: 'Please save those changes if you want them to reflect in survey.',
      successButtonText: 'Close',
      cancelButtonText: 'Cancel',
      description: 'The changes will be removed permanently.',
      type: 'workflow-check',
      data: {}
    }
    setGenericModalObj(genDeleteObj);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };


  return (
    <Box sx={{ backgroundColor: defaultColor?.backgroundColor, height: 'calc(100vh - 69px)' }} >
      <Box sx={LayoutStyles.localSurveyNavbar} >
        <Box display={'flex'} >
          {showSurveyName &&
            <Typography
              style={{ position: 'relative', top: '15px', paddingLeft: '20px', cursor: 'pointer', fontSize: '17px' }}
              color={'#f1f1f1'} >
              {surveyDetail?.name?.substring(0, 45)}
              {surveyDetail?.name?.length > 45 ? '...' : ''}
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
            <IconButton onClick={() => handleCloseEditName(true)} size='small' sx={iconStyle} >
              <CloseIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>
          }
        </Box>
        <Box display={'flex'} >
          {
            surveyDetail?.is_published === true &&
            <Button
              endIcon={<VisibilityIcon />}
              onClick={showPreview}
              style={{ width: '110px', marginRight: '10px' }}
              sx={ButtonStyles.outlinedButton}
              variant="text"
            >
              Test Run
            </Button>
          }
          <Button
            endIcon={surveyDetail?.is_published === true ? <CloseIcon /> : <DoneIcon />}
            onClick={handleDisableEnableSurvey}
            style={{ width: '110px' }}
            sx={ButtonStyles.containedButton}
            variant="contained"
          >
            {surveyDetail?.is_published === true ? 'Unpublish' : 'Publish'}
          </Button>
          {/* <IconButton onClick={handleClick} sx={{ width: '40px', marginTop: '10px', marginLeft: '10px' }} >
            <MoreVertIcon />
          </IconButton> */}
          <WorkflowMore
            anchor={anchorEl}
            open={open}
            close={() => setAnchorEl(null)}
            openLogs={() => setOpenSurveyLogs(true)}
          />
        </Box>
      </Box>
      <Box display={'flex'} >
        <Box width={isWorkflowPublished === true ? '100%' : '77%'} >
          <FeedbackCanvas
            published={isWorkflowPublished}
            flow={surveyFlow}
            config={componentConfig}
            surveyDetail={surveyDetail}
            onEdit={handleComponentEditClick}
            performSave={handleSaveFlow}
            dirty={() => { checkWorkflow(true) }}
            ref={childRef}
          />
        </Box>
        {
          isWorkflowPublished === false &&
          <Box sx={{ borderLeft: '1px #454545 solid', overflowY: 'scroll', height: 'calc(100vh - 130px)' }} width={'23%'} >
            <FeedbackComponentList />
          </Box>
        }
      </Box>

      <DynamicComponentModal
        close={() => setOpenEditModal(false)}
        open={openEditModal}
        uiId={comUiId}
        compId={componentId}
        save={handleSaveComponentConfig}
        data={componentConfig}
        isPublished={isWorkflowPublished}
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
      <SurveyLogsModal
        surveyId={currentWorkflowId}
        open={openSurveyLogs}
        close={() => setOpenSurveyLogs(false)}
      />
    </Box>
  )
}

export default CreateSurvey

export const iconStyle = {
  marginTop: '5px',
  padding: '10px',
  paddingTop: '10px',
  paddingLeft: '10px'
}