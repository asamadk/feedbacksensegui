import { Box, Typography } from '@mui/material'
import React from 'react'
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const mainContainerCss = {
    padding : '12px 12px', 
    borderRadius : '6px', 
    cursor : 'pointer', 
    display : 'flex',
    position : 'fixed',
    marginLeft : '10px',
    bottom : '10px'
}

function PoweredBy(props : any) {
  return (
    <Box sx={mainContainerCss} >
      {
        props.imgData == null ?
        <>
          <Typography marginTop={'3px'} fontSize={'12px'} color={'black'} marginRight={'5px'} >Powered by</Typography>
          <Typography fontWeight={900} fontSize={'16px'} color={'#006dff'} >Feedback</Typography>
          <Typography fontWeight={900} fontSize={'16px'} color={'#29292a'} >Sense</Typography>
        </> :
        <>
          <img style={{ height: '50px', borderRadius: '6px' }} src={props.imgData} alt="Uploaded Preview" />
        </>
      }
    </Box>
  )
}

export default PoweredBy