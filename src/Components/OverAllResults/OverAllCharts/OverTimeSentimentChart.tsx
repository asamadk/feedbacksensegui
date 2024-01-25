import { Box, Typography } from '@mui/material'
import React from 'react'
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import FSTooltip from '../../FSTooltip'
import { colorPalette } from '../../../Utils/Constants'

function OverTimeSentimentChart(props : any) {

    return (
        <>
            <Box textAlign={'start'} padding={'20px'}>
                <Typography sx={{textDecoration : 'underline'}} color={colorPalette.darkBackground} variant='h6' marginBottom={'20px'} >Over-time Sentiment Analysis</Typography>
                <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
                    <ResponsiveContainer>
                        <LineChart
                            data={props?.data}
                        >
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                                cursor={{ fill: 'none' }}
                                content={<FSTooltip percent={true} />}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="Positive" stroke="#04FF04" />
                            <Line type="monotone" dataKey="Neutral" stroke="#006dff" />
                            <Line type="monotone" dataKey="Negative" stroke="#FF0000" />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </>
    )
}

export default OverTimeSentimentChart