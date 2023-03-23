import { Box } from '@mui/material'
import React from 'react'

function CustomChip(props : any) {
    return (
        <>
        {
            props.status === 'success' ? 
        <Box sx={{ border: '1px #0eee85 solid', color: '#0eee85', padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Enabled
        </Box> : <Box sx={{ border: '1px #454545 solid', color: '#454545', padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Disabled
        </Box>
        }
        </>
    )
}

export default CustomChip