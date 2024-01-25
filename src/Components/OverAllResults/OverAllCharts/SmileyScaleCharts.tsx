import { Box, Typography } from '@mui/material'
import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'
import FSTooltip from '../../FSTooltip'
import { colorPalette } from '../../../Utils/Constants'

type propsType = {
  id: number,
  data: any
}

function SmileyScaleCharts(props: propsType) {
  return (
    <Box>
      <Box textAlign={'start'} margin={'15px'} paddingLeft={'10px'}>
        <Typography fontSize={20} color={colorPalette.darkBackground} paddingBottom={'10px'}>{props?.data?.question}</Typography>
        {/* <Divider/> */}
      </Box>
      <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
        <ResponsiveContainer>
          <BarChart data={props?.data?.statsArr}>
            <Legend />
            <YAxis dataKey="percentage" />
            <XAxis dataKey="satisfaction" />
            <Tooltip
              cursor={{ fill: 'none' }}
              content={<FSTooltip percent={true} />}
            />
            <Bar barSize={40} dataKey='percentage' fill={getIconColorById(props.id)} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default SmileyScaleCharts
