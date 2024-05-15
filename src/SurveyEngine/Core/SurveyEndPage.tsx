import { Box, Button, Typography } from '@mui/material'
import * as ButtonStyles from '../../Styles/ButtonStyle';
import { colorPalette } from '../../Utils/Constants';

const bodyStyle: {} = {
    height: '100vh',
    color : colorPalette.darkBackground
}

const subContainerStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
}

function SurveyEndPage() {

    return (
        <Box sx={{...bodyStyle,backgroundColor : colorPalette.textSecondary}} >
            <Box sx={subContainerStyle} >
                <Box display={'flex'} justifyContent={'center'}>
                    <img style={{ width: '50px' }} src='/logo-churn.png' alt='Logo' />
                </Box>
                <Box marginTop={'10px'} >
                    <Typography style={{ color: colorPalette.primary, fontSize: '24px' }}>
                        Thank you for filling out this survey🎉
                    </Typography>
                </Box>
                <CreateOwnSurvey/>
            </Box>
        </Box>
    )
}

export default SurveyEndPage

function CreateOwnSurvey(){

    const handleCreateSurvey = () => {
        const url = `https://${window.location.host}/login`
        window.open(url,'__target');
    }

    return(
        <Box marginTop={'20px'} color={'#f1f1f1'} >
            <Typography color={colorPalette.darkBackground} fontSize={20} >Want to create your own surveys?</Typography>
            <Typography color={'#808080'} fontSize={14} >See how easy it is to get feedback using FeedbackSense</Typography>
            <Button onClick={handleCreateSurvey} sx={ButtonStyles.containedButton} style={{width : 'fit-content'}} >
                {'Create your own survey'}
            </Button>
        </Box>
    )
}