import { Box, Tab, Tabs } from '@mui/material'
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import React, { useState } from 'react'
import IndividualResponse from '../Components/IndividualResponse';
import { useParams } from 'react-router';
import OverAllResult from '../Components/OverAllResult';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import OverAllAIAnalysis from '../Components/OverAllAIAnalysis';
import { colorPalette } from '../Utils/Constants';
import CustomTabSet from '../Components/CustomTabSet';

const mainContainerCss = {
  height: 'calc(100vh - 69px)',
  display: 'flex',
}

function AnalyzeSurvey() {

  const { surveyId } = useParams();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleSelectedTabChange = (event : any,newValue: number) => {
    setSelectedTab(newValue);
  };


  return (
    <Box sx={{ ...mainContainerCss, backgroundColor: colorPalette.textSecondary }} >
      <Box width={'6%'} >
        <Tabs
          orientation="vertical"
          value={selectedTab}
          onChange={handleSelectedTabChange}
          sx={{ borderRight: `0.5px ${colorPalette.fsGray} solid`, height: 'calc(100vh - 69px)' }}
        >
          <Tab
            value={0}
            sx={{ width: 'fit-content' }}
            icon={<EqualizerIcon />}
          />
          <Tab value={1} sx={{ width: 'fit-content' }} icon={<AssignmentIndIcon />} />
          {/* <Tab value={2} sx={{ width: 'fit-content' }} icon={<AutoFixHighIcon />} /> */}
        </Tabs>
      </Box>
      <Box width={'94%'} >
        <DynamicTabContainer
          surveyId={surveyId}
          tab={selectedTab}
        />
      </Box>
    </Box>
  )
}

export default AnalyzeSurvey

function DynamicTabContainer(props: any) {
  return (
    <>
      {props.tab === 0 && <OverAllResult surveyId={props.surveyId} />}
      {props.tab === 1 && <IndividualResponse surveyId={props.surveyId} />}
      {/* {props.tab === 2 && <OverAllAIAnalysis surveyId={props.surveyId} />} */}
    </>
  )
}