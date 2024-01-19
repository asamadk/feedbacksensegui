import { Box, Button, Typography } from '@mui/material'
import * as ButtonStyles from '../../Styles/ButtonStyle';
import { useSelector } from 'react-redux';

const bodyStyle: {} = {
    height: '100vh',
    textAlign : 'start'
}

const subContainerStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
}

function SurveyEndPage() {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    return (
        <Box sx={{...bodyStyle,backgroundColor : defaultColor?.backgroundColor}} >
            <Box sx={subContainerStyle} >
                <Box display={'flex'} >
                    <Typography style={{ color: '#f1f1f1', fontSize: '30px' }} variant='h4' >Feedback</Typography>
                    <Typography style={{ color: '#006dff', fontSize: '30px' }} variant='h4' >Sense</Typography>
                </Box>
                <Box marginTop={'10px'} >
                    <Typography style={{ color: '#f1f1f1', fontSize: '24px' }}>
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
            <Typography fontSize={20} >Want to create your own surveys?</Typography>
            <Typography color={'#808080'} fontSize={14} >See how easy it is to get feedback using FeedbackSense</Typography>
            <Button onClick={handleCreateSurvey} sx={ButtonStyles.containedButton} style={{width : 'fit-content'}} >
                {'Create your own survey'}
            </Button>
        </Box>
    )
}