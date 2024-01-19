import { Box } from '@mui/material'
import React from 'react'

function CustomChip(props : any) {
    return (
        <>
        {
            props.status === 'success' ? 
        <Box sx={{ border: '1px #006dff solid', color: '#006dff', padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Published
        </Box> : <Box sx={{ border: '1px #808080 solid', color: '#808080', padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Unpublished
        </Box>
        }
        </>
    )
}

export default CustomChip