import { Box } from '@mui/material'
import React, { useState } from 'react'
import TemplateDetailLeftPanel from '../Components/TemplateDetailComponent/TemplateDetailLeftPanel'
import TemplateDetailRightPanel from '../Components/TemplateDetailComponent/TemplateDetailRightPanel'
import { useLocation } from 'react-router';

function TemplateDetailLayout() {

    const { state } = useLocation();
    const [template , setTemplate] = useState<any>(state);

    return (
        <Box height={'calc(100vh - 58px)'} display={'flex'} padding={'0px'}>
            <Box width={'25%'} >
                <TemplateDetailLeftPanel template={template} />
            </Box>
            <Box width={'75%'} >
                <TemplateDetailRightPanel template={template} />
            </Box>
        </Box>
    )
}

export default TemplateDetailLayout