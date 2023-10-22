import { Box, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BarChartIcon from '@mui/icons-material/BarChart';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { surveyIdProp } from '../../Utils/types';
import { getOverallMetricsResponse } from '../../Utils/Endpoints';
import { USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { useNavigate } from 'react-router';
import { handleLogout } from '../../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';

const subContainerStyle = (bgColor : string) => {
    return {
        border: '1px #454545 solid',
        padding: '10px',
        width: '33%',
        borderRadius: '6px',
        margin: '20px',
        marginTop: '25px',
        backgroundColor : bgColor
    }
}

const mainContainer = {
    display: 'flex',
    width: '100%',

}

function OverAllMetrics(props : surveyIdProp) {

    const navigate = useNavigate();
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const snackbarRef: any = useRef(null);
    const [loading , setLoading] = React.useState(false);
    const [overAllMetrics, setOverAllMetrics] = React.useState<any>();
    let init = false;

    useEffect(() => {
        if(init === false){
            getOverAllMetrics();
            init = true;
        }
    }, []);

    const getOverAllMetrics = async() => {
        try {
            setLoading(true);
            const { data } = await axios.get(getOverallMetricsResponse(props.surveyId),{withCredentials : true});
            setLoading(false);
            if(data.statusCode !== 200){
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            setOverAllMetrics(data?.data);
        } catch (error : any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
                handleLogout();
            }
        }
    }

    return (
        <Box sx={mainContainer}>
            <Box sx={subContainerStyle(defaultColor?.primaryColor)} >
                <Box display={'flex'}  >
                    <Box sx={{ backgroundColor: '#454545', borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                        <TextSnippetIcon sx={{ color: '#f1f1f1' }} />
                    </Box>
                    <Box sx={{ color: '#f1f1f1', textAlign: 'start', paddingLeft: '20px' }} >
                        <Typography fontSize={16} >Last Response</Typography>
                        <Typography fontSize={24} >{overAllMetrics?.lastResponse}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={subContainerStyle(defaultColor?.primaryColor)} >
                <Box display={'flex'}  >
                    <Box sx={{ backgroundColor: '#454545', borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                        <BarChartIcon sx={{ color: '#f1f1f1' }} />
                    </Box>
                    <Box sx={{ color: '#f1f1f1', textAlign: 'start', paddingLeft: '20px' }} >
                        <Typography fontSize={16} >Completion Rate</Typography>
                        <Typography fontSize={24} >{overAllMetrics?.completionRate}</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={subContainerStyle(defaultColor?.primaryColor)} >
                <Box display={'flex'}  >
                    <Box sx={{ backgroundColor: '#454545', borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                        <RemoveRedEyeIcon sx={{ color: '#f1f1f1' }} />
                    </Box>
                    <Box sx={{ color: '#f1f1f1', textAlign: 'start', paddingLeft: '20px' }} >
                        <Typography fontSize={16} >Total Views</Typography>
                        <Typography fontSize={24} >{overAllMetrics?.totalViews}</Typography>
                    </Box>
                </Box>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default OverAllMetrics