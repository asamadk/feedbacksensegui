import { Box, Tab, Tabs } from '@mui/material'
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import React, { useState } from 'react'
import IndividualResponse from '../Components/IndividualResponse';
import { useParams } from 'react-router';
import OverAllResult from '../Components/OverAllResult';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useSelector } from 'react-redux';
import OverAllAIAnalysis from '../Components/OverAllAIAnalysis';

const mainContainerCss = {
  height: 'calc(100vh - 69px)',
  display: 'flex',
}

function AnalyzeSurvey() {

  const { surveyId } = useParams();

  const defaultColor = useSelector((state: any) => state.colorReducer);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSelectedTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const [showOverAllPopover, setShowOverAllPopover] = useState(false);

  const handleOpenShowAll = () => {
    setShowOverAllPopover(true);
  }

  const handleCloseShowAll = () => {
    setShowOverAllPopover(false);
  }

  return (
    <Box sx={{...mainContainerCss,backgroundColor : defaultColor?.backgroundColor}} >
      <Box width={'6%'} >
        <Tabs
          orientation="vertical"
          value={selectedTab}
          onChange={handleSelectedTabChange}
          sx={{ borderRight: '1px #454545 solid', height: 'calc(100vh - 69px)' }}
        >
          <Tab
            value={0}
            sx={{ width: 'fit-content' }}
            onMouseEnter={handleOpenShowAll}
            onMouseLeave={handleCloseShowAll}
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