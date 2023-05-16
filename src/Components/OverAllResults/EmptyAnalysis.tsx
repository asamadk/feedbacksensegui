import { Box, Typography } from '@mui/material'
import React from 'react'

function EmptyAnalysis() {
  return (
    <Box color={'#f1f1f1'} marginTop={'10%'}>
            <Box>
                <img 
                  style={{width : '250px',margin : 'auto'}} 
                  alt='There are no results'
                  src='/emptyAnalysis.png'
                ></img>
            </Box>
            <Typography variant='h6'>There are no results</Typography>
            <Typography color={'#808080'} >You have not collected any responses yet</Typography>
            <Typography color={'#808080'} >Any response your receive will appear here!</Typography>
        </Box>
  )
}

export default EmptyAnalysis