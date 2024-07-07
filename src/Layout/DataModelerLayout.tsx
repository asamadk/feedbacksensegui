import React, { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { listStyleBlock } from '../Styles/LayoutStyles'
import { colorPalette } from '../Utils/Constants'
import { containedButton } from '../Styles/ButtonStyle'
import { useNavigate } from 'react-router'
import CustomerJourneyModeler from '../Components/CustomerJourneyModeler'

function DataModelerLayout() {

    const [display, setDisplay] = useState(0);

    function MainDisplay() {
        if (display !== 0) { return <></> }
        return (
            <>
                <Box sx={listStyleBlock} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Customer Journey Stages</Typography>
                        <Typography sx={{ color: colorPalette.fsGray,fontSize : '13px' }} >
                            Create your own custom customer journey
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            // onClick={handleCustomJourneyOpen}
                            onClick={() => setDisplay(1)}
                        >Details</Button>
                    </Box>
                </Box>

                <Box sx={listStyleBlock} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Onboarding Stages</Typography>
                        <Typography sx={{ color: colorPalette.fsGray,fontSize : '13px' }} >
                            Create custom stages for customer onboarding
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            onClick={() => setDisplay(2)}
                        >Details</Button>
                    </Box>
                </Box>

                <Box sx={listStyleBlock} >
                    <Box textAlign={'start'} >
                        <Typography fontWeight={600} >Risk Stages</Typography>
                        <Typography sx={{ color: colorPalette.fsGray,fontSize : '13px' }} >
                            Create custom risk stages
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            size='small'
                            sx={containedButton}
                            onClick={() => setDisplay(3)}
                        >Details</Button>
                    </Box>
                </Box>
            </>
        )
    }

    function CustomerJourneyModelerDisplay() {
        if (display !== 1 && display !== 2 && display !== 3) { return <></> }
        let type :'Stage' | 'Onboarding' | 'Risk' = 'Stage';
        if(display === 2){type = 'Onboarding';}
        if(display === 3){type = 'Risk';}
        return <CustomerJourneyModeler type={type} backClick={() => setDisplay(0)} />
    }

    return (
        <Box>
            {MainDisplay()}
            {CustomerJourneyModelerDisplay()}
        </Box>
    )
}

export default DataModelerLayout