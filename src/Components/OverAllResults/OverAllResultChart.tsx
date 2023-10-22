import { Box, Divider, Fab, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getOverallResponse } from '../../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { useNavigate } from 'react-router';
import { handleLogout } from '../../Utils/FeedbackUtils';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import { iconStyle } from '../../Layout/CreateSurvey';
import FSTooltip from '../FSTooltip';
import { useSelector } from 'react-redux';

const mainContainer = (bgColor : string) => {
    return {
        margin: '20px',
        marginTop: '25px',
        border: '1px #454545 solid',
        borderRadius: '6px',
        backgroundColor: bgColor
    }
};

const mainTextStyle = {
    color: '#f1f1f1',
    textAlign: 'start',
    fontSize: '20px',
    fontWeight: '500',
    marginBottom: '15px',
    paddingTop: '10px',
    paddingLeft: '10px'
};

type propsType = {
    surveyId: string,
    empty: any,
    notEmpty: any
};

function OverAllResultChart(props: propsType) {
    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [overAllResultGraph, setOverAllResultGraph] = useState<any[]>([]);
    let init = false;

    useEffect(() => {
        if(init === false){
            getOverAllResponseForChart();
            init = true;
        }
    }, []);

    const getOverAllResponseForChart = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getOverallResponse(props.surveyId), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            setOverAllResultGraph(data?.data);
            if (data?.data?.length < 1) {
                props.empty();
            } else {
                props.notEmpty();
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            props.empty();
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    };

    const handleDownload = () => {
        const chartContainer: any = document.querySelector('.recharts-wrapper');
        html2canvas(chartContainer)
            .then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'chart.png';
                link.click();
            })
            .catch((error) => {
                console.error('Error generating chart image:', error);
            });

    };

    return (
        <Box sx={mainContainer(defaultColor?.primaryColor)}>
            <Box display={'flex'} justifyContent={'space-between'} >
                <Typography sx={mainTextStyle}>Response</Typography>
                <IconButton sx={iconStyle} onClick={handleDownload} size='small' aria-label="add">
                    <DownloadIcon sx={{color : '#006DFF'}} />
                </IconButton>
            </Box>
            <Divider sx={{ borderTop: '1px #454545 solid', marginBottom: '20px' }} />
            <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'}>
                <ResponsiveContainer>
                    <BarChart data={overAllResultGraph}>
                        <YAxis />
                        <Tooltip 
                            cursor={{fill: 'none'}} 
                            content={<FSTooltip />} 
                        />
                        <XAxis dataKey="date" />
                        <Bar barSize={40} dataKey="Response" fill="#006DFF" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    );
}

export default OverAllResultChart;
