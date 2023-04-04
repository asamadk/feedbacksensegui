import { Alert, Box, Button, IconButton, Snackbar, TextField, Typography } from '@mui/material'
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
import axios from 'axios';
import { SURVEY_LOCAL_KEY } from '../Utils/Constants';
import Notification from '../Utils/Notification';


function CreateSurvey() {

  const snackbarRef = useRef(null);
  const { surveyId } = useParams();

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [componentId, setComponentId] = React.useState<string>();
  const [comUiId, setCompUiId] = React.useState<string>('');
  const [componentConfig, setComponentConfig] = React.useState<Map<string, object>>(new Map());
  const [surveyDetail, setSurveyDetail] = React.useState<any>();
  const [showSurveyName, setShowSurveyName] = React.useState(true);

  useEffect(() => {
    getSingleSurvey();
  }, [])

  const getSingleSurvey = async () => {
    let { data } = await axios.get(Endpoints.getSurveyDetails(surveyId));
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if (isValidated === false) {
      return;
    }
    if (data != null) {
      setSurveyDetail(data.data);
      localStorage.setItem(SURVEY_LOCAL_KEY, JSON.stringify(data.data));
    }
  }

  const handleComponentEditClick = (uId: string, compId: string) => {
    setComponentId(compId);
    setCompUiId(uId);
    setOpenEditModal(true);
  }

  const handleSavecomponentConfig = (data: any) => {
    const currRef :any= snackbarRef?.current;
    currRef?.show('Saved.','success');
    let tempMap = componentConfig;
    tempMap?.set(comUiId, data);
    setComponentConfig(tempMap);
    setOpenEditModal(false)
  }

  const handleSaveFlow = (flow: any) => {
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

  }

  const saveFlow = async (flow: any) => {
    const saveFlowTemp = JSON.stringify(flow);
    console.log('Flow = ',saveFlowTemp);
    const { data } = await axios.post(Endpoints.saveSurveyFlow(surveyDetail.id),flow);
    const isValidated = FeedbackUtils.validateAPIResponse(data);
    if(isValidated === false){
      return;
    }

    console.log('saveFlow :: data',data);

    if(data.statusCode === 200){
      const currRef :any= snackbarRef?.current;
      currRef?.show('Configuration saved.','success');
    }
    //TODO show saved alerts
  }

  const handleEditNameClick = () => {
    setShowSurveyName(false);
  }

  return (
    <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)' }} >
      <Box sx={LayoutStyles.localSurveyNavbar} >
        <Box display={'flex'} >
          <Typography
            style={{ position: 'relative', top: '15px', paddingLeft: '10px', cursor: 'pointer', fontSize: '17px' }}
            color={'#f1f1f1'} >
            {surveyDetail?.name}
          </Typography>
          {showSurveyName &&
            <IconButton onClick={handleEditNameClick} size='small' style={{ padding: '0px', paddingTop: '10px', paddingLeft: '10px' }} >
              <ModeEditOutlineOutlinedIcon sx={{ color: '#f1f1f1' }} />
            </IconButton>}
            {/* {showSurveyName === false &&
              <CssTextField
                sx={{ input: { color: 'white' } }}
                id="outlined-basic"
                value={surveyDetail?.name}
                variant="outlined"
                size='small'
                style={{ width: '100%' }}
          />
            } */}
        </Box>
        <Button style={{ width: '110px' }} sx={ButtonStyles.containedButton} variant="contained">Preview</Button>
      </Box>
      <Box display={'flex'} >
        <Box width={'77%'} >
          <FeedbackCanvas
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
      />

      <Notification ref={snackbarRef}/>
    </Box>
  )
}

export default CreateSurvey