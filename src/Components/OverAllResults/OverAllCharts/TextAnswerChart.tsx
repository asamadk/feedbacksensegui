import { Box, Chip, Divider, Pagination, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SentimentAnalysisChart from './SentimentAnalysisChart'
import OverTimeSentimentChart from './OverTimeSentimentChart'
import { useSelector } from 'react-redux'
import { AI_TEXT_ANALYSIS, WORD_CLOUD } from '../../../Utils/CustomSettingsConst'
import UpgradePlanError from '../../UpgradePlanError'
import { colorPalette } from '../../../Utils/Constants'
import CustomWordCloud from './WordCloud'

const mainContainer = {
    marginTop: '20px',
    color: colorPalette.darkBackground,
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
    const [showWordCloud, setShowWordCloud] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [answersPerPage] = useState(7); // Number of answers per page
    const [paginatedAnswers, setPaginatedAnswers] = useState([]);

    let init = false;

    useEffect(() => {
        if (init === false) {
            handleVisibility();
            init = true;
        }
    }, []);

    useEffect(() => {
        const indexOfLastAnswer = currentPage * answersPerPage;
        const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
        setPaginatedAnswers(data?.statsArr?.slice(indexOfFirstAnswer, indexOfLastAnswer));
    }, [currentPage, data?.statsArr, answersPerPage]);

    const handleVisibility = () => {
        if (settings != null && settings[AI_TEXT_ANALYSIS] === 'true') {
            setShowAiAnalysis(true);
        } else {
            setShowAiAnalysis(false);
        }

        if (settings != null && settings[WORD_CLOUD] === 'true') {
            setShowWordCloud(true);
        } else {
            setShowWordCloud(false);
        }
    }

    return (
        <>
            <Box sx={mainContainer} >
                <Box marginBottom={'20px'} >
                    <Typography fontSize={20} paddingBottom={'10px'} >{props?.data?.question}</Typography>
                </Box>

                <Typography fontWeight={600} >Answers</Typography>
                {
                    paginatedAnswers?.map((answers: string) => {
                        return (
                            <Box sx={{ background: colorPalette.textSecondary, padding: '5px 10px', borderRadius: '5px', marginTop: '10px', boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px' }} >
                                <Box display={'flex'} justifyContent={'space-between'} >
                                    <Typography >{answers}</Typography>
                                </Box>
                            </Box>
                        )
                    })
                }
                <Stack direction={'row-reverse'} spacing={2} marginTop={'20px'} >
                    <Pagination
                        count={Math.ceil((data?.statsArr.length || 0) / answersPerPage)}
                        variant="outlined"
                        shape="rounded"
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                    />
                </Stack>
                <Box marginTop={'10px'} >
                    <Typography color={'#808080'} >
                        Total : <span style={{ color: colorPalette.fsGray }}>{data?.statsArr?.length} response</span>
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
                                        {
                                            showWordCloud ?
                                                <CustomWordCloud data={data?.wordCloud} /> :
                                                <Box marginTop={'100px'} marginRight={'10px'} >
                                                    <UpgradePlanError
                                                        message='Upgrade for Word Cloud'
                                                        desc='Unlock the power of word cloud.Upgrade now to gain valuable insights 
                                                        for your survey.Get more details and unleash your full potential with our pro plan.'
                                                        showButton={true}
                                                    />
                                                </Box>
                                        }
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