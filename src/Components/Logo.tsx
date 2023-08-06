import { Box, Typography } from '@mui/material'
import React from 'react'
import InsertLinkIcon from '@mui/icons-material/InsertLink';

const mainContainerCss = {
    backgroundColor : '#323533', 
    width : 'fit-content',
    display : 'flex',
    borderRadius : '10px',
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
        // <Box display={'flex'} >
        //     <Box sx={{backgroundColor : '#f1f1f1',padding : '5px',width : '70px'}} >
        //         <Typography>Feedback</Typography>
        //     </Box>
        //     <Box sx={{backgroundColor : '#006dff',padding : '5px',width : '70px'}} >
        //         <Typography color={'#f1f1f1'} >Sense</Typography>
        //     </Box>
        // </Box>
    )
}

export default Logo