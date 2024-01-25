import { Box } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'

function CustomChip(props : any) {
    return (
        <>
        {
            props.status === 'success' ? 
        <Box sx={{ border: `1px ${colorPalette.primary} solid`, color: colorPalette.secondary, padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Published
        </Box> : <Box sx={{ border: `0.5px ${colorPalette.textPrimary} solid`, color: colorPalette.fsGray, padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
            Unpublished
        </Box>
        }
        </>
    )
}

export default CustomChip