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
      <Divider sx={{ borderTop: '1px #454545 solid', margin: '10px 0px' }} />
      <Box display={'flex'} justifyContent={'space-between'} >
        {data?.actions?.map((action : string) => {return(<Typography color={'#808080'} >{action}</Typography>)})}
        <Typography color={'#808080'} >{data?.clickFrequency} times</Typography>
      </Box>
    </Box>
  )
}

export default WelcomeChart