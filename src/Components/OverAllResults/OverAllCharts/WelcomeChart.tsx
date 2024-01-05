import { Box, Divider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const mainContainer = {
  marginTop : '20px',
  color : '#f1f1f1',
  textAlign : 'start',
  padding : '20px'
}

type propsType = {
  id: number,
  data : any
}

function WelcomeChart(props : propsType) {

  const [data,setData] = useState(props.data);

  return (
    <Box sx={mainContainer} >
      <Typography fontWeight={600} >Actions</Typography>
      <Box sx={{ background: 'rgba(255, 255, 255, 0.12)', padding: '5px 10px', borderRadius: '5px', marginTop: '10px' }} >
        <Box display={'flex'} justifyContent={'space-between'} >
          {data?.actions?.map((action : string) => {return(<Typography color={'#f1f1f1'} >{action}</Typography>)})}
          <Typography color={'#f1f1f1'} >{data?.clickFrequency} times</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default WelcomeChart