import { Box } from '@mui/material'
import React from 'react'
import { workflowLiveWarning } from '../../Styles/ModalStyle'

function ModalSnippets({ published,text }: any) {
    return (
        <>
            {
                published &&
                <Box sx={workflowLiveWarning} >
                    {text}
                </Box>
            }
        </>
    )
}

export default ModalSnippets