import { Box, Typography } from '@mui/material'
import React from 'react'

function Popover(props: any) {
    return (
        <>
            {
                props.open &&
                <Box sx={{ backgroundColor: '#454545', position: 'absolute', padding: '10px', zIndex: 10, borderRadius: '5px',color : '#f1f1f1' }} >
                    <Typography style={{ fontSize: '14px' }} >{props.text}</Typography>
                </Box>
            }
        </>
    )
}

export default Popover