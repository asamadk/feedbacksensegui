import { Box, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { colorPalette } from '../Utils/Constants'

const surveyBlockMainContainer = {
    borderRadius: '5px',
    cursor: 'pointer',
    height: '197px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
}

function FlowTemplateBlockComponent() {
    return (
        <Box sx={{ ...surveyBlockMainContainer, backgroundColor: colorPalette.textSecondary }} >
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', height: '50px' }}
            >
                <Box>
                    <Tooltip title={'Flow Name'} >
                        <Typography
                            aria-haspopup="true"
                            sx={{ paddingTop: '10px', color: colorPalette.textPrimary }}
                        >
                            Flow template Name
                        </Typography>
                    </Tooltip>
                    <Typography
                        aria-haspopup="true"
                        sx={{ paddingTop: '10px', color: colorPalette.fsGray,textAlign : 'start' }}
                    >
                        Description
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default FlowTemplateBlockComponent