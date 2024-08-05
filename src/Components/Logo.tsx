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
            </Box>
        </Box>
    )
}

export default Logo