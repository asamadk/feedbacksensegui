import React from 'react'
import { Box, Typography } from '@mui/material'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getIconColorById } from '../../../Utils/FeedbackUtils'
import GaugeChart from 'react-gauge-chart';
import FSTooltip from '../../FSTooltip';
import { colorPalette } from '../../../Utils/Constants';

type propsType = {
  id: number,
  data : any
}

const textContainer = {
  color : colorPalette.darkBackground,
  textAlign : 'start',
  margin : '20px',
}

function NPSCharts(props : propsType) {
  return (
    <Box>
      <Box sx={textContainer} >
        <Typography fontSize={20} >{props?.data?.question}</Typography>
      </Box>
      <Box sx={{ width: '100%', height: 300 }} display={'flex'} justifyContent={'space-around'} >
        <NPSScore score={props?.data?.nps} />
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

export default NPSCharts

function NPSScore({ score } : any){
  return(
    <Box paddingTop={'50px'} >
      <GaugeChart id="gauge-chart1"
        style={{color : 'red'}}
        colors={["#FF5F6D", "#90EE90"]} 
        percent={score/100} 
        nrOfLevels={2} 
      />
      <Typography fontSize={20} fontWeight={600} color={colorPalette.darkBackground} >{score}%</Typography>
    </Box>
  )
}