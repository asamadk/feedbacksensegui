import { Box, Typography } from '@mui/material'
import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'

type propsType = {
  id: number,
  data: any
}

function SmileyScaleCharts(props: propsType) {
  return (
    <Box>
      <Box textAlign={'start'} margin={'15px'} paddingLeft={'10px'}>
        <Typography fontSize={20} color={'#f1f1f1'} paddingBottom={'10px'}>Question : {props?.data?.question}</Typography>
        {/* <Divider/> */}
      </Box>
      <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
        <ResponsiveContainer>
          <BarChart data={props?.data?.statsArr}>
            <Legend />
            <YAxis dataKey="percentage" />
            <XAxis dataKey="satisfaction" />
            <Bar barSize={40} dataKey='percentage' fill={getIconColorById(props.id)} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default SmileyScaleCharts
