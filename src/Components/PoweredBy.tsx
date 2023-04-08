import { Box, Typography } from '@mui/material'
import React from 'react'

const mainContainerCss = {
    border : '1px rgb(144 140 141 / 10%) solid', 
    padding : '12px 12px', 
    borderRadius : '6px', 
    background : '#f1f1f1',
    boxShadow: '0 0 2px rgba(23,29,26,.15)',
    cursor : 'pointer', 
    display : 'flex',
    position : 'fixed',
    marginLeft : '10px',
    bottom : '20px'
}

function PoweredBy() {
  return (
    <Box sx={mainContainerCss} >
        <Typography marginTop={'3px'} fontSize={'12px'} color={'black'} marginRight={'5px'} >Powered by</Typography>
        <Typography fontWeight={900} fontSize={'16px'} color={'#29292a'} >FeedbackSense</Typography>
    </Box>
  )
}

export default PoweredBy