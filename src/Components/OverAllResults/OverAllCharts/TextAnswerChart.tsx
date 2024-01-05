import { Box, Chip, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SentimentAnalysisChart from './SentimentAnalysisChart'
import WordCloud from './WordCloud'
import TopicClusterChart from './TopicClusterChart'
import OverTimeSentimentChart from './OverTimeSentimentChart'
import { TabList } from '@mui/lab'
import TopicsDisplay from './TagList'
import { useSelector } from 'react-redux'
import { AI_TEXT_ANALYSIS } from '../../../Utils/CustomSettingsConst'
import UpgradePlanError from '../../UpgradePlanError'

const mainContainer = {
    marginTop: '20px',
    color: '#f1f1f1',
    textAlign: 'start',
    padding: '20px'
}

type propsType = {
    id: number,
    data: any
}

function TextAnswerChart(props: propsType) {

    const settings = useSelector((state: any) => state.settings);
    const [data, setData] = useState(props.data);
    const [showAiAnalysis, setShowAiAnalysis] = useState(false);
    let init = false;

    useEffect(() => {
        if (init === false) {
            handleVisibility();
            init = true;
        }
    }, []);

    const handleVisibility = () => {
        if (settings != null && settings[AI_TEXT_ANALYSIS] === 'true') {
            setShowAiAnalysis(true);
        } else {
            setShowAiAnalysis(false);
        }
    }

    return (
        <>
            <Box sx={mainContainer} >
                <Box marginBottom={'20px'} >
                    <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'} >{props?.data?.question}</Typography>
                </Box>

                <Typography fontWeight={600} >Answers</Typography>
                {
                    data?.statsArr?.map((answers: string) => {
                        return (
                            <Box sx={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }} >
                                <Box display={'flex'} justifyContent={'space-between'} >
                                    <Typography color={'#f1f1f1'} >{answers}</Typography>
                                </Box>
                            </Box>
                        )
                    })
                }
                <Box marginTop={'10px'} >
                    <Typography color={'#808080'} >
                        Total : <span style={{ color: '#f1f1f1' }}>{data?.statsArr?.length} response</span>
                    </Typography>
                </Box>
            </Box>
            {
                showAiAnalysis === true &&
                <Box>
                    {
                        data?.statsArr?.length > 15 ?
                        <Box>
                            <Box display={'flex'} width={'100%'} >
                                <Box width={'50%'} >
                                    <SentimentAnalysisChart data={data?.sentimentData} />
                                </Box>
                                {/* <Box width={'50%'} >
                                    <TopicsDisplay topics={data?.topicModel} />
                                </Box> */}
                                <Box width={'50%'} >
                                    <WordCloud data={data?.wordCloud} />
                                </Box>
                            </Box>
                            <Box>
                                {
                                    data?.overTimeSentiment?.length >= 3 ?
                                    <Box width={'100%'} >
                                        <OverTimeSentimentChart data={data?.overTimeSentiment} />
                                    </Box> : 
                                    <Box marginBottom={'20px'} >
                                        <UpgradePlanError
                                            message='Not enough responses'
                                            desc='Collect responses for more than a week to unlock Sentiment Overtime Analysis'
                                            showButton={false}
                                        />
                                    </Box>
                                }
                            </Box>
                        </Box> : 
                        <Box marginBottom={'20px'} >
                            <UpgradePlanError
                                message='Not enough responses'
                                desc='Collect more than 15 response to unlock AI Analysis'
                                showButton={false}
                            />
                        </Box>
                    }
                </Box>
            }
        </>
    )
}

export default TextAnswerChart