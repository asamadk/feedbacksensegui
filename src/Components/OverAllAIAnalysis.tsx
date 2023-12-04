import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import EmptyAnalysis from './OverAllResults/EmptyAnalysis';
import SentimentAnalysisChart from './OverAllResults/OverAllCharts/SentimentAnalysisChart';
import TopicClusterChart from './OverAllResults/OverAllCharts/TopicClusterChart';
import OverTimeSentimentChart from './OverAllResults/OverAllCharts/OverTimeSentimentChart';
import { useSelector } from 'react-redux';
import UpgradePlanError from './UpgradePlanError';
import WordCloud from './OverAllResults/OverAllCharts/WordCloud';

type propType = {
    surveyId: string
}

function OverAllAIAnalysis(props: propType) {

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showUpgrade , setShowUpgrade] = useState(false);

    const getEmptyAnalysis = () => {
        return (
            !showUpgrade && isEmpty &&
            <EmptyAnalysis />
        )
    }

    const mainContainer = (bgColor: string) => {
        return {
            margin: '20px',
            marginTop: '25px',
            border: '1px #454545 solid',
            borderRadius: '6px',
            backgroundColor: bgColor
        }
    }

    const getAIAnalysis = () => {
        return (
            !showUpgrade && !isEmpty && <>
                <Box sx={mainContainer(defaultColor?.primaryColor)} >
                    <SentimentAnalysisChart />
                </Box>
                <Box sx={mainContainer(defaultColor?.primaryColor)} >
                    <TopicClusterChart />
                </Box>
                <Box sx={mainContainer(defaultColor?.primaryColor)} >
                    <OverTimeSentimentChart />
                </Box>
            </>
        )
    }

    const showUpgradeScreen = () => {
        return(
            showUpgrade && <>
                <Box sx={mainContainer(defaultColor?.primaryColor)} >
                    <Box padding={'20px'} >    
                        <UpgradePlanError  
                            message='Upgrade to Access the AI Analysis'
                            desc='Unlock our most advanced analysis.Upgrade now to gain valuable insights 
                            for your survey.Get more details and unleash your full potential with our ultimate plan.'
                        />
                    </Box>
                </Box>
            </>
        )
    }

    return (
        <Box height={'calc(100vh - 100px)'} sx={{ overflowY: 'scroll' }} >
            <Box sx={{ textAlign: 'start', paddingTop: '4px', paddingLeft: '10px', borderBottom: '1px #454545 solid', height: '48px' }} >
                <Typography
                    paddingTop={'10px'}
                    paddingLeft={'10px'}
                    fontSize={'14px'}
                    fontWeight={'600'}
                    color={'#006DFF'} >
                    AI analysis results
                </Typography>
            </Box>
            {getAIAnalysis()}
            {getEmptyAnalysis()}
            {showUpgradeScreen()}
        </Box>
    )
}

export default OverAllAIAnalysis