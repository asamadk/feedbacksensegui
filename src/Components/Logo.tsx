import { Box, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'

const mainContainerCss = {
    width: 'fit-content',
    display: 'flex'
}

function Logo() {
    return (
        <Box sx={{ cursor: 'pointer' }}>
            <Box sx={mainContainerCss} >
                <img
                    style={{ width: '30px',height : '30px',marginTop : '8px' }}
                    src='/fs_logo_small.png'
                    alt='Logo'
                />
                <Typography
                    style={{ color: colorPalette.primary, fontSize: '20px',marginTop : '11px',marginLeft : '10px' }}
                    variant='h4'
                >
                    feedbacksense
                </Typography>
            </Box>
        </Box>
    )
}

export default Logo