import { Box, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'

const mainContainerCss = {
    width: 'fit-content',
    display: 'flex'
    // padding : '5px 12px',
    // marginTop : '5px',
}

function Logo() {
    return (
        <Box sx={{ cursor: 'pointer' }}>
            <Box sx={mainContainerCss} >
                <img
                    style={{ width: '50px' }}
                    src='/fs_logo_small.png'
                    alt='Logo'
                />
                <Typography
                    style={{ color: colorPalette.primary, fontSize: '22px',marginTop : '10px',marginLeft : '10px' }}
                    variant='h4'
                >
                    feedbacksense
                </Typography>
            </Box>
        </Box>
    )
}

export default Logo