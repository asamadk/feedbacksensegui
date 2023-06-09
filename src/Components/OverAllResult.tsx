import { Box, Divider, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import OverAllResultChart from './OverAllResults/OverAllResultChart';
import OverAllMetrics from './OverAllResults/OverAllMetrics';
import DynamicCompOverallRes from './OverAllResults/DynamicCompOverallRes';
import EmptyAnalysis from './OverAllResults/EmptyAnalysis';

type IndividualResponseProps = {
    surveyId: string
}

function OverAllResult(props: IndividualResponseProps) {

    const [isEmpty ,setIsEmpty] = useState(false);

    return (
        <Box height={'calc(100vh - 100px)'} sx={{ overflowY: 'scroll' }} >
            <Box sx={{ textAlign: 'start', paddingTop: '4px', paddingLeft: '10px', borderBottom: '1px #454545 solid', height: '48px' }} >
                <Typography
                    paddingTop={'10px'}
                    paddingLeft={'10px'}
                    fontSize={'14px'}
                    fontWeight={'600'}
                    color={'#f3d503'} >
                    {'Overall Result'}
                </Typography>
            </Box>
            {
                isEmpty === false && 
                <OverAllResultChart 
                    empty={() => setIsEmpty(true)}
                    notEmpty={() => setIsEmpty(false)}
                    surveyId={props.surveyId} 
                />
            }
            {isEmpty === false && <OverAllMetrics surveyId={props.surveyId} />}
            {isEmpty === false && <DynamicCompOverallRes surveyId={props.surveyId} />}
            {isEmpty === true && <EmptyAnalysis/>}
        </Box>
    )
}

export default OverAllResult