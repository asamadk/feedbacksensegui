import { Box, Divider, Fab, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getOverallResponse } from '../../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { USER_UNAUTH_TEXT, colorPalette } from '../../Utils/Constants';
import { handleLogout } from '../../Utils/FeedbackUtils';
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import { iconStyle } from '../../Layout/CreateSurvey';
import FSTooltip from '../FSTooltip';
import { useSelector } from 'react-redux';
import { durationType } from '../../Utils/types';

const mainContainer = (bgColor: string) => {
    return {
        margin: '20px',
        marginTop: '25px',
        borderRadius: '6px',
        backgroundColor: bgColor,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }
};

const mainTextStyle = {
    color: colorPalette.darkBackground,
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
    notEmpty: any,
    dateFilter: durationType,
};

function OverAllResultChart(props: propsType) {
    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = React.useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [overAllResultGraph, setOverAllResultGraph] = useState<any[]>([]);
    let init = false;

    useEffect(() => {
        if (init === false) {
            getOverAllResponseForChart();
            init = true;
        }
    }, [props.dateFilter]);

    const getOverAllResponseForChart = async () => {
        try {
            setLoading(true);
            const URL = getOverallResponse(props.surveyId, props.dateFilter);
            const { data } = await axios.get(URL, { withCredentials: true });
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
        <Box sx={mainContainer(colorPalette.background)}>
            <Box display={'flex'} justifyContent={'space-between'} >
                <Typography sx={mainTextStyle}>Response</Typography>
            </Box>
            <Box sx={{ width: '100%', height: 300, marginTop: '20px' }} margin={'auto'} width={'fit-content'}>
                <ResponsiveContainer>
                    <BarChart data={overAllResultGraph}>
                        <YAxis />
                        <Tooltip
                            cursor={{ fill: 'none' }}
                            content={<FSTooltip />}
                        />
                        {/* <CartesianGrid strokeDasharray="0" stroke="#1e1e1e" /> */}
                        <XAxis dataKey="date" />
                        <Bar barSize={40} dataKey="Response" fill={colorPalette.primary} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    );
}

export default OverAllResultChart;
