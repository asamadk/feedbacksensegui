import React from 'react'
import { Box } from '@mui/material'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'

type propsType = {
  id: number,
  data: any
}

function RatingScaleCharts(props: propsType) {
  return (
    <Box>
      <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
        <ResponsiveContainer>
          <BarChart data={props?.data}>
            <YAxis dataKey="percentage" />
            <XAxis dataKey="range" />
            <Bar barSize={40} dataKey='percentage' fill={getIconColorById(props.id)} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default RatingScaleCharts

const data = [
  {
    name: 'Page A',
    percentage: 10,
    range: '0'
  },
  {
    name: 'Page A',
    percentage: 35,
    range: '1'
  },
  {
    name: 'Page A',
    percentage: 2,
    range: '2'
  },
  {
    name: 'Page A',
    percentage: 80,
    range: '3'
  },
  {
    name: 'Page A',
    percentage: 100,
    range: '4'
  }
]