import React from 'react'
import { Box, Typography } from '@mui/material'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'
import GaugeChart from 'react-gauge-chart';
import FSTooltip from '../../FSTooltip';
import { colorPalette } from '../../../Utils/Constants';
import { TextContainer } from 'html2canvas/dist/types/dom/text-container';

type propsType = {
    id: number,
    data: any
}

const textContainer = {
    textAlign: 'start',
    margin: '20px',
}

function CSATChart(props: propsType) {
    return (
        <Box>
            <Box sx={textContainer} >
                <Typography fontSize={20} >{props?.data?.question}</Typography>
            </Box>
            <Box sx={{ width: '100%', height: 300 }} display={'flex'} justifyContent={'space-around'} >
                <CSATScore score={props?.data?.score} />
                <ResponsiveContainer>
                    <BarChart width={600} height={250} data={props?.data?.chart}>
                        <YAxis dataKey="percentage" />
                        <XAxis dataKey="value" />
                        <Tooltip cursor={{ fill: 'none' }} />
                        <Bar barSize={40} dataKey='percentage' fill={getIconColorById(props.id)} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    )
}

export default CSATChart

function CSATScore({ score }: any) {
    return (
        <Box padding={'50px'} width={'20%'} >
            <Box sx={{borderRadius : '6px',boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',padding : '20px',textAlign : 'center',background : colorPalette.textSecondary}} >
                <Typography fontSize={13} fontWeight={600} >CSAT Score</Typography>
                <Typography variant='h4' fontWeight={600} >{score}</Typography>
            </Box>
            <Typography fontSize={11} sx={{color : colorPalette.fsGray,marginTop : '10px'}} >Total no. of satisfied customers divided by total responses</Typography>
        </Box>
    )
}