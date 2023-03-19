import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton } from '@mui/material';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CustomTabSet from '../Components/CustomTabSet';

const makeButtonUp = {
    position: 'relative',
    top: '-7px'
}

const makeIconsUp = {
    position: 'relative',
    top: '-2px'
}

const tabsetList = [
    { id : 1,name : 'CREATE' },
    { id : 2,name : 'DESIGN / PREVIEW' },
    { id : 3,name : 'CONFIGURE' },
    { id : 4,name : 'SHARE' },
    { id : 5,name : 'ANALYZE' },
]

function SurveyDetailHeader(props :any) {

    const [tabset, setTabset] = React.useState(parseInt(props.tabset))

    const changetabset = (value: number) => {
        console.log('Tab cahnging ',value);
        setTabset(value);
    }

    return (
        <Box sx={{display : 'flex'}} >
            <Box sx={{display : 'flex', justifyContent : 'center'}} >
                <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={props.tabset} />
            </Box>
            <Box sx={{display : 'flex'}} >
                <Box sx={makeButtonUp} >
                    <Button style={{ width: 'fit-content' }} sx={ButtonStyles.outlinedBlackButton} variant="contained">Next</Button>
                </Box>
                <IconButton sx={makeIconsUp} color='warning' ><CloseIcon sx={{ color: '#f1f1f1' }} /></IconButton>
            </Box>
        </Box>
    )
}

export default SurveyDetailHeader