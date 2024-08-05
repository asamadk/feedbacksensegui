import { Box, Typography } from '@mui/material'
import React from 'react'
import { CopyBlock, dracula } from 'react-code-blocks'
import * as LayoutStyles from '../Styles/LayoutStyles'
import { useSelector } from 'react-redux'

let integrationCode = `
    Exciting News! We're working on an amazing new feature to enhance your experience with RetainSense. 
    Stay tuned for its release, coming soon! We can't wait to share it with you and help you bring 
    RetainSense to your website or app. Thank you for your continued support!"`

function SurveySettingsWeb() {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    return (
        <Box sx={LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor)} >
            <Box textAlign={'start'} >
                <Typography color={'#f1f1f1'} sx={{ marginBottom: '5px' }} >Install RetainSense on your own (Comming Soon) </Typography>
                <Typography color={'#808080'} sx={{ marginBottom: '10px' }} >
                    Add the RetainSense snippet using one of the methods below so you can start collecting website and in-product surveys feedback.
                </Typography>
                <Box >
                <CopyBlock
                    text={integrationCode}
                    language={'python'}
                    theme={dracula}
                    codeBlock
                />
                </Box>
            </Box>
        </Box>
    )
}

export default SurveySettingsWeb