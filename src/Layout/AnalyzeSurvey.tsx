import { Box, Tab, Tabs, styled } from '@mui/material'
import EqualizerIcon from '@mui/icons-material/Equalizer';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import React, { useState } from 'react'
import IndividualResponse from '../Components/IndividualResponse';
import { useParams } from 'react-router';
import OverAllResult from '../Components/OverAllResult';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import OverAllAIAnalysis from '../Components/OverAllAIAnalysis';
import { colorPalette } from '../Utils/Constants';

const mainContainerCss = {
  height: 'calc(100vh - 69px)',
  display: 'flex',
}

function AnalyzeSurvey() {

  const { surveyId } = useParams();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleSelectedTabChange = (event: any, newValue: number) => {
    setSelectedTab(newValue);
  };

  interface StyledTabProps {
    // label: string;
    icon: any,
    value: number
  }

  interface StyledTabsProps {
    children?: React.ReactNode;
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
  }

  const StyledTabs = styled((localProps: StyledTabsProps) => (
    <Tabs
      orientation='vertical'
      {...localProps}
      TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
  ))({
    '& .MuiTabs-indicator': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    '& .MuiTabs-indicatorSpan': {
      maxWidth: 50,
      width: '100%',
      backgroundColor: colorPalette.primary,
      // backgroundColor: 'transparent',
    }
  });

  const StyledTab = styled((props: StyledTabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    textTransform: 'none',
    marginRight: theme.spacing(1),
    color: colorPalette.darkBackground,
    '&.Mui-selected': {
      color: colorPalette.primary,
      fontWeight: 600,
      // background : '#ddd5e6',
      borderRadius: '7px'
    },
    '&.Mui-focusVisible': {
      backgroundColor: colorPalette.secondary,
    },
    fontWeight: 550
  }));

  return (
    <Box sx={{ ...mainContainerCss, backgroundColor: colorPalette.textSecondary }} >
      <Box width={'6%'} >
        <StyledTabs
          // orientation="vertical"
          value={selectedTab}
          onChange={handleSelectedTabChange}
          sx={{ borderRight: `0.5px ${colorPalette.fsGray} solid`, height: 'calc(100vh - 69px)' }}
        >
          <StyledTab
            value={0}
            sx={{ width: 'fit-content' }}
            icon={<EqualizerIcon />}
          />
          <StyledTab
            value={1}
            sx={{ width: 'fit-content' }}
            icon={<AssignmentIndIcon />}
          />
          {/* <Tab value={2} sx={{ width: 'fit-content' }} icon={<AutoFixHighIcon />} /> */}
        </StyledTabs>
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