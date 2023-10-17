import { Box, Typography } from '@mui/material'
import React from 'react'

function UnAuthorisedComponent({ color } : {color : string}) {
  return (
    <Box sx={{color : color}} >
        <Typography>You do not have permission to access this resource</Typography>
    </Box>
  )
}

export default UnAuthorisedComponent