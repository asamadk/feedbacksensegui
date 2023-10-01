import { Box } from '@mui/material'
import React from 'react'
import { workflowLiveWarning } from '../../Styles/ModalStyle'

function ModalSnippets({ published }: any) {
    return (
        <>
            {
                published &&
                <Box sx={workflowLiveWarning} >
                    To make changes, please unpublish the workflow
                </Box>
            }
        </>
    )
}

export default ModalSnippets