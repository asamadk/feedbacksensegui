import { Alert, Box, Button, Snackbar } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import FeedbackCanvas from '../FlowComponents/FeedbackCanvas'
import 'reactflow/dist/style.css';
import FeedbackComponentList from '../FlowComponents/FeedbackComponentList'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as LayoutStyles from '../Styles/LayoutStyles'
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import DynamicComponentModal from '../FlowComponents/DynamicComponentModal';
import { useParams } from 'react-router';
import axios from 'axios';

function CreateSurvey() {

  const { surveyId  } = useParams();

  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [componentId, setComponentId] = React.useState<string>();
  const [comUiId, setCompUiId] = React.useState<string>('');
  const [componentConfig, setComponentConfig] = React.useState<Map<string,object>>(new Map());
  const [openAlert, setOpenAlert] = React.useState(false);
  const [surveyDetail , setSurveyDetail] = React.useState<any>();

  useEffect(() => {
    getSingleSurvey();
  },[])

  const getSingleSurvey = async () => {
    let res = await axios.get(Endpoints.getSurveyDetails(surveyId));
    const isValidated = FeedbackUtils.validateAPIResponse(res);
    if(isValidated === false){
      return;
    }

    let resData : any = res.data;
    if(resData != null){
      setSurveyDetail(resData);
    }
  }

  const handleComponentEditClick = (uId: string, compId: string) => {
    setComponentId(compId);
    setCompUiId(uId);
    setOpenEditModal(true);
  }

  const handleSavecomponentConfig = (data: any) => {
    setOpenAlert(true);
    let tempMap = componentConfig;
    tempMap?.set(comUiId,data);
    setComponentConfig(tempMap);
    console.log('Map = ',tempMap);
  }

  const handleSaveFlow = (flow : any) => {
    if(flow == null || flow.length < 1){
      return;
    }

    if(componentConfig.size < 1){
      saveFlow(flow);
      return;
    }

    for(const key in flow){
      if(key.toLowerCase() !== 'nodes'){
        continue;
      }
      let nodeList : any[] = flow[key];
      nodeList.forEach(n => {
        if(componentConfig.has(n.id)){
          n.data.compConfig = componentConfig.get(n.id);
        }
      });
    }
    saveFlow(flow);

  }

  const saveFlow = (flow : any) => {
      //TODO save flow
      console.log('Save flow = ', flow)
  }

  return (
    <Box sx={{ backgroundColor: '#1E1E1E', height: 'calc(100vh - 69px)' }} >
      <Box sx={LayoutStyles.localSurveyNavbar} >
        <Button style={{ width: '110px' }} sx={ButtonStyles.containedButton} variant="contained">Preview</Button>
      </Box>
      <Box display={'flex'} >
        <Box width={'77%'} >
          <FeedbackCanvas
            surveyDetail = {surveyDetail}
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
      <Snackbar open={openAlert} autoHideDuration={3000} onClose={() => setOpenAlert(false)}>
        <Alert onClose={() => setOpenAlert(false)} severity="success" sx={{ width: '100%' }}>
          Saved succesfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default CreateSurvey