import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton } from '@mui/material';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CustomTabSet from '../Components/CustomTabSet';
import { useNavigate } from 'react-router';
import { SURVEY_LOCAL_KEY } from '../Utils/Constants';

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
    
    let navigate = useNavigate();

    const handleRouteToHome = () => {
        // localStorage.removeItem(SURVEY_LOCAL_KEY);
        navigate('/');
    }

    const [tabset, setTabset] = React.useState(parseInt(props.tabset))

    const changetabset = (value: number) => {
        setTabset(value);
        if(value === 0){
            navigate('/survey/detail/create/'+props.surveyId);
        }else if(value === 1){
            navigate('/survey/detail/design/'+props.surveyId);
        }else if(value === 2){
            navigate('/survey/detail/configure/'+props.surveyId);
        }else if(value === 3){
            navigate('/survey/detail/share/'+props.surveyId);
        }else if(value === 4){
            navigate('/survey/detail/analyze/'+props.surveyId);
        }
    }

    return (
        <Box sx={{display : 'flex'}} >
            <Box sx={{display : 'flex', justifyContent : 'center'}} >
                <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={props.tabset} />
            </Box>
            <Box sx={{display : 'flex'}} >
                {/* <Box sx={makeButtonUp} >
                    <Button style={{ width: 'fit-content' }} sx={ButtonStyles.outlinedBlackButton} variant="contained">Next</Button>
                </Box> */}
                <IconButton onClick={handleRouteToHome} sx={makeIconsUp} color='warning' ><CloseIcon sx={{ color: '#f1f1f1' }} /></IconButton>
            </Box>
        </Box>
    )
}

export default SurveyDetailHeader