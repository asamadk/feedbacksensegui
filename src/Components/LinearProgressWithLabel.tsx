import React from 'react'
import Box from '@mui/material/Box';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number } & { text : string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress style={{backgroundColor : '#454545'}} variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="#f1f1f1">{props.text}</Typography>
        </Box>
      </Box>
  )
}

export default LinearProgressWithLabel