import { Box, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BarChartIcon from '@mui/icons-material/BarChart';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import axios from 'axios';
import { durationType } from '../../Utils/types';
import { getOverallMetricsResponse } from '../../Utils/Endpoints';
import { USER_UNAUTH_TEXT, colorPalette } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import { useSelector } from 'react-redux';

const subContainerStyle = (bgColor: string) => {
    return {
        // border: '1px #454545 solid',
        padding: '10px',
        width: '33%',
        borderRadius: '6px',
        margin: '20px',
        marginTop: '25px',
        backgroundColor: bgColor,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }
}

const mainContainer = {
    display: 'flex',
    width: '100%',
}

type propType = {
    surveyId: string,
    dateFilter : durationType
}

function OverAllMetrics(props: propType) {

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [overAllMetrics, setOverAllMetrics] = React.useState<any>();
    let init = false;

    useEffect(() => {
        if (init === false) {
            getOverAllMetrics();
            init = true;
        }
    }, [props.dateFilter]);

    const getOverAllMetrics = async () => {
        try {
            setLoading(true);
            const URL = getOverallMetricsResponse(props.surveyId,props.dateFilter);
            const { data } = await axios.get(URL, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            setOverAllMetrics(data?.data);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    return (
        <>
            {
                overAllMetrics != null &&
                <Box sx={mainContainer}>
                    <Box sx={subContainerStyle(colorPalette.background)} >
                        <Box display={'flex'}  >
                            <Box sx={{ backgroundColor: colorPalette.primary, borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                                <TextSnippetIcon sx={{ color: colorPalette.background }} />
                            </Box>
                            <Box sx={{ color: colorPalette.darkBackground, textAlign: 'start', paddingLeft: '20px' }} >
                                <Typography fontSize={16} >Last Response</Typography>
                                <Typography fontSize={24} >{overAllMetrics?.lastResponse}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={subContainerStyle(colorPalette.background)} >
                        <Box display={'flex'}  >
                            <Box sx={{ backgroundColor: colorPalette.primary, borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                                <BarChartIcon sx={{ color: colorPalette.background }} />
                            </Box>
                            <Box sx={{ color: colorPalette.darkBackground, textAlign: 'start', paddingLeft: '20px' }} >
                                <Typography fontSize={16} >Completion Rate</Typography>
                                <Typography fontSize={24} >{overAllMetrics?.completionRate}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={subContainerStyle(colorPalette.background)} >
                        <Box display={'flex'}  >
                            <Box sx={{ backgroundColor: colorPalette.primary, borderRadius: '6px', padding: '10px', paddingTop: '17px' }} >
                                <RemoveRedEyeIcon sx={{ color: colorPalette.background }} />
                            </Box>
                            <Box sx={{ color: colorPalette.darkBackground, textAlign: 'start', paddingLeft: '20px' }} >
                                <Typography fontSize={16} >Total Views</Typography>
                                <Typography fontSize={24} >{overAllMetrics?.totalViews}</Typography>
                                {/* <Typography fontSize={24} >{10000}</Typography> */}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            }
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default OverAllMetrics