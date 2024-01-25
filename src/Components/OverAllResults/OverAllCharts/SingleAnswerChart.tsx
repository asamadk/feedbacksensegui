import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Bar, Cell, ComposedChart, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'
import FSTooltip from '../../FSTooltip'
import { colorPalette } from '../../../Utils/Constants'

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

function SingleAnswerChart(props: propsType) {

    return (
        <Box sx={mainContainer} >
            <Typography fontSize={20} color={colorPalette.darkBackground} paddingBottom={'10px'} >{props?.data?.question}</Typography>
            <SingleAnswerBarChart data={props.data} id={props.id} />
            <Typography fontWeight={600} >Answers</Typography>
            {
                props?.data?.statsArr?.map((answers: any) => {
                    return (
                        <Box sx={{ background: colorPalette.textSecondary,boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }} >
                            <Box display={'flex'} justifyContent={'space-between'} >
                                <Typography
                                    color={colorPalette.darkBackground}
                                    sx={{ flexWrap: 'wrap', overflowX: 'scroll', marginRight: '40px' }}
                                >{answers?.name}</Typography>
                                <Typography color={colorPalette.textSecondary} >{answers?.Frequency}%</Typography>
                            </Box>
                        </Box>
                    )
                })
            }
        </Box>
    )
}

export default SingleAnswerChart


function SingleAnswerBarChart(props: any) {

    return (
        <Box marginTop={3} marginBottom={3} >
            <ResponsiveContainer height={props?.data?.statsArr.length * 100 || 400} >
                <ComposedChart
                    layout="vertical"
                    data={props?.data?.statsArr}
                    margin={{
                        top: 20,
                        right: 50,
                        bottom: 20,
                        left: 50
                    }}
                >
                    <XAxis dataKey="Frequency" type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip
                        content={<FSTooltip percent={true} />}
                    />
                    <Bar dataKey="Frequency" barSize={40} fill={getIconColorById(props.id)} />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    )
}