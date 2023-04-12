import { Alert, Box, Button, IconButton, Snackbar, styled, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
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
import { SURVEY_LOCAL_KEY } from '../Utils/Constants';
import Notification from '../Utils/Notification';
import FSLoader from '../Components/FSLoader';

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

function CreateSurvey(props : any) {

  const snackbarRef: any = useRef(null);
  const { surveyId } = useParams();

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [componentId, setComponentId] = React.useState<string>();
  const [comUiId, setCompUiId] = React.useState<string>('');
  const [surveyFlow, setSurveyFlow] = React.useState<any>();
  const [componentConfig, setComponentConfig] = React.useState<Map<string, object>>(new Map());
  const [surveyDetail, setSurveyDetail] = React.useState<any>();
  const [showSurveyName, setShowSurveyName] = React.useState(true);
  const [ loading , setLoading] = React.useState(false);

  useEffect(() => {
    getSingleSurvey();
  }, [])

  const getSingleSurvey = async () => {
    setLoading(true);
    let { data } = await axios.get(Endpoints.getSurveyDetails(surveyId));
    setLoading(false);
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
      return;
    }
    if (data != null) {
      setSurveyDetail(data.data);
      if (data?.data?.workflows != null && data?.data.workflows.length > 0) {
        setSurveyFlow(data?.data?.workflows[0]);
      }
      props.updateSurveyId(data.data.id)
    }
  }

  const handleComponentEditClick = (uId: string, compId: string) => {
    setComponentId(compId);
    setCompUiId(uId);
    setOpenEditModal(true);
  }

  const handleSavecomponentConfig = (data: any) => {
    let tempMap = componentConfig;
    const validatedComp = FeedbackUtils.validateFlowComponent(JSON.parse(data), componentId);
    if (validatedComp !== null) {
      snackbarRef?.current?.show(validatedComp, 'error');
      return;
    }
    tempMap?.set(comUiId, data);
    setComponentConfig(tempMap);
    setOpenEditModal(false);
    snackbarRef?.current?.show('Saved.', 'success');
  }

  const handleSaveFlow = (flow: any) => {
    try {
      if (flow == null || flow.length < 1) {
        return;
      }
      if (componentConfig.size < 1) {
        saveFlow(flow);
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
      saveFlow(flow);
    } catch (error) {
      console.log('Exception :: handleSaveFlow :: ', error);
      snackbarRef?.current?.show('Something went wrong.', 'error');
    }

  }

  const saveFlow = async (flow: any) => {
    setLoading(true);
    const { data } = await axios.post(Endpoints.saveSurveyFlow(surveyDetail.id), flow);
    setLoading(false);
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
      return;
    }

    if (data.statusCode === 200) {
      snackbarRef?.current?.show('Configuration saved.', 'success');
    }

    //TODO show saved alerts
  }

  const handleEditNameClick = () => {
    setShowSurveyName(false);
  }

  const handleCloseEditName = () => {
    setShowSurveyName(true);
  }

  const handleSaveNameClick = async () => {
    snackbarRef?.current?.show('Survey name updated.', 'success');
    const payload = {
      surveyName: surveyDetail.name
    }
    setLoading(true);
    const { data } = await axios.post(Endpoints.updateSurveyName(surveyDetail.id), payload)
    setLoading(false);
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
      snackbarRef?.current?.show('Something went wrong.', 'error');
      return;
    }

    handleCloseEditName();
  }

  const handleFlowNameChange = (e: any) => {
    let tempSurveyDetail = JSON.parse(JSON.stringify(surveyDetail));
    tempSurveyDetail.name = e.target.value;
    setSurveyDetail(tempSurveyDetail);
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
            <IconButton onClick={handleEditNameClick} size='small' style={{ padding: '0px', paddingTop: '10px', paddingLeft: '10px' }} >
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
            <IconButton onClick={handleSaveNameClick} size='small' style={{ padding: '0px', paddingTop: '10px', paddingLeft: '10px' }} >
              <SaveAltIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>
          }
          {
            showSurveyName === false &&
            <IconButton onClick={handleCloseEditName} size='small' style={{ padding: '0px', paddingTop: '10px', paddingLeft: '10px' }} >
              <CloseIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>
          }
        </Box>
        <Button style={{ width: '110px' }} sx={ButtonStyles.containedButton} variant="contained">Preview</Button>
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
        <Box sx={{ borderLeft: '1px #454545 solid', overflowY: 'scroll' }} width={'23%'} >
          <FeedbackComponentList />
        </Box>
      </Box>

      <DynamicComponentModal
        close={() => setOpenEditModal(false)}
        open={openEditModal}
        uiId={comUiId}
        compId={componentId}
        save={handleSavecomponentConfig}
        flow={surveyFlow}
      />

      <Notification ref={snackbarRef} />
      <FSLoader show={loading} />
    </Box>
  )
}

export default CreateSurvey