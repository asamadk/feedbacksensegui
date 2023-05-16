import { Box, Divider, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { getOverallResponse } from '../../Utils/Endpoints';
import axios from 'axios';
import FSLoader from '../FSLoader';
import Notification from '../../Utils/Notification';
import { surveyIdProp } from '../../Utils/types';
import { USER_UNAUTH_TEXT } from '../../Utils/Constants';
import { useNavigate } from 'react-router';

const mainContainer = {
    margin: '20px',
    marginTop: '25px',
    border: '1px #454545 solid',
    borderRadius: '6px',
    backgroundColor : '#1A1A1A'
}

const mainTextStyle={
    color : '#f1f1f1',
    textAlign : 'start',
    fontSize : '20px',
    fontWeight : '500',
    marginBottom : '15px',
    paddingTop : '10px',
    paddingLeft : '10px'
}

type propsType = {
    surveyId: string,
    empty : any,
    notEmpty : any
}

function OverAllResultChart(props: propsType) {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const [loading , setLoading] = React.useState(false);
    const [overAllResultGraph, setOverAllResultGraph] = useState<any[]>([]);


    useEffect(() => {
        getOverAllResponseForChart();
    }, [])

    const getOverAllResponseForChart = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getOverallResponse(props.surveyId),{withCredentials : true});
            setLoading(false);
            if(data.statusCode !== 200){
                console.log('data?.message',data?.message);
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            setOverAllResultGraph(data?.data);
            if(data?.data?.length < 1){
                props.empty();
            }else{
                props.notEmpty();
            }
        } catch (error : any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            props.empty();
            setLoading(false);
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
                navigate('/login');
            }
        }
    }

    return (
        <Box sx={mainContainer} >
            <Typography sx={mainTextStyle}>Response</Typography>
            <Divider sx={{ borderTop: '1px #454545 solid', marginBottom: '20px' }} />
            <Box sx={{ width: '100%', height: 300 }} margin={'auto'} width={'fit-content'} >
                <ResponsiveContainer>
                    <BarChart data={overAllResultGraph}>
                        <YAxis />
                        <XAxis dataKey="date" />
                        <Bar barSize={40} dataKey='Response' fill="#FFA500" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default OverAllResultChart