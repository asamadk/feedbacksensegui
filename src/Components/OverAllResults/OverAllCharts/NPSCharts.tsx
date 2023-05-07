import React from 'react'
import { Box, Typography } from '@mui/material'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'
import GaugeChart from 'react-gauge-chart';

type propsType = {
  id: number,
  data : any
}

const textContainer = {
  color : '#f1f1f1',
  textAlign : 'start',
  margin : '20px',
}

function NPSCharts(props : propsType) {
  return (
    <Box>
      <Box sx={textContainer} >
        <Typography fontSize={20} >How likely is it that you will recommend our product to a friend or colleague?</Typography>
      </Box>
      <Box sx={{ width: '100%', height: 300 }} display={'flex'} justifyContent={'space-around'} >
        <NPSScore score={props?.data?.nps} />
        <ResponsiveContainer>
          <BarChart width={600} height={250} data={props?.data?.chart}>
            <YAxis dataKey="percentage" />
            <XAxis dataKey="value" />
            <Bar barSize={40} dataKey='percentage' fill={getIconColorById(props.id)} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default NPSCharts

function NPSScore({ score } : any){
  return(
    <Box paddingTop={'50px'} >
      <GaugeChart id="gauge-chart1"
        colors={["#FF5F6D", "#90EE90"]} 
        percent={score/100} 
        nrOfLevels={2} 
      />
    </Box>
  )
}