import { Box, Chip, Divider, Typography } from '@mui/material'
import React, { useState } from 'react'
import SentimentAnalysisChart from './SentimentAnalysisChart'
import WordCloud from './WordCloud'
import TopicClusterChart from './TopicClusterChart'
import OverTimeSentimentChart from './OverTimeSentimentChart'
import { TabList } from '@mui/lab'
import TopicsDisplay from './TagList'

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

const ldaTopics = [
    ['useful', 'grow', 'feedback', 'idea'],
    ['useful', 'lab'],
    ['useful'],
    ['sens', 'trend', 'feedback', 'idea'],
    ['sens', 'trend', 'feedback'],
    // ... other topics
];

function TextAnswerChart(props: propsType) {

    const [data, setData] = useState(props.data);

    return (
        <>
            <Box sx={mainContainer} >
                <Box marginBottom={'20px'} >
                    <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'} >Question : {props?.data?.question}</Typography>
                </Box>

                <Typography fontWeight={600} >Answers</Typography>
                {
                    data?.statsArr?.map((answers: string) => {
                        return (
                            <Box>
                                <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
                                <Box display={'flex'} justifyContent={'space-between'} >
                                    <Typography color={'#808080'} >{answers}</Typography>
                                </Box>
                            </Box>
                        )
                    })
                }
                <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
                <Box>
                    <Typography color={'#808080'} >
                        Total : <span style={{ color: '#f1f1f1' }}>{data?.statsArr?.length} response</span>
                    </Typography>
                </Box>
            </Box>
            <Box display={'flex'} width={'100%'} >
                <Box width={'50%'} >
                    <SentimentAnalysisChart data={data?.sentimentData} />
                </Box>
                <Box width={'50%'} >
                    <TopicsDisplay topics={data?.topicModel} />
                </Box>
            </Box>
            <Box display={'flex'} width={'100%'} >
                <Box width={'50%'} >
                    <WordCloud data={data?.wordCloud} />
                </Box>
                <Box width={'50%'} >
                    <OverTimeSentimentChart data={data?.overTimeSentiment} />
                </Box>
            </Box>
        </>
    )
}

export default TextAnswerChart