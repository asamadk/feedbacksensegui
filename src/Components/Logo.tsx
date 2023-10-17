import { Box, Typography } from '@mui/material'
import React from 'react'
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const mainContainerCss = {
    backgroundColor : '#212a2b', 
    width : 'fit-content',
    display : 'flex',
    borderRadius : '5px',
    padding : '5px 12px'
}

function Logo() {
    return (
        <Box sx={{cursor : 'pointer'}}>
            <Box sx={mainContainerCss} >
                <Typography style={{ color: '#006DFF', fontSize: '22px' }} variant='h4'>Feedback</Typography>
                <InsertLinkIcon sx={{color : '#ffffff',marginTop : '2px',marginRight : '2px'}} />
                <Typography style={{ color: '#ffffff', fontSize: '22px' }} variant='h4'>Sense</Typography>
            </Box>
        </Box>
    )
}

export default Logo