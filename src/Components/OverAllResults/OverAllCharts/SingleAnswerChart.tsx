import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Bar, Cell, ComposedChart, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'

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

function SingleAnswerChart(props: propsType) {

    useEffect(() => {
        console.log("🚀 ~ file: SingleAnswerChart.tsx:23 ~ useEffect ~ props.data:", props.data)
    }, []);

    return (
        <Box sx={mainContainer} >
            <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'} >Question : {props?.data?.question}</Typography>
            <SingleAnswerBarChart data={props.data} id={props.id} />
            <Typography fontWeight={600} >Answers</Typography>
            {
                props?.data?.statsArr?.map((answers: any) => {
                    return (
                        <Box>
                            <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
                            <Box display={'flex'} justifyContent={'space-between'} >
                                <Typography
                                    color={'#808080'}
                                    sx={{ flexWrap: 'wrap', overflowX: 'scroll', marginRight: '40px' }}
                                >{answers?.name}</Typography>
                                <Typography color={'#808080'} >{answers?.Frequency}%</Typography>
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
        <Box sx={{ width: '100%', height: 300 }} marginTop={3} marginBottom={3} >
            <ResponsiveContainer>
                <ComposedChart
                    layout="vertical"
                    width={1200}
                    height={400}
                    data={props?.data?.statsArr}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }}
                >
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" scale="band" />
                    <Tooltip />
                    <Bar dataKey="Frequency" barSize={20} fill={getIconColorById(props.id)} />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    )
}