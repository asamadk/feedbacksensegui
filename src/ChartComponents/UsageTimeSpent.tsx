import React, { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getLineChartColor } from '../Utils/FeedbackUtils';
import { Box } from '@mui/material';
import { colorPalette } from '../Utils/Constants';

function UsageTimeSpent(props: any) {

    const [showUI, setShowUI] = useState(true);

    useEffect(() => {
        if (props.data == null || props.data.length < 1) {
            setShowUI(false);
        } else {
            setShowUI(true);
        }
    }, [props.data]);

    function EmptyUI() {
        return <Box height={300} >
            <img style={{ height: '100%', width: '100%', margin: 'auto' }} src='/no-data.svg' alt='No Data' />
        </Box>
    }

    function ChartUI() {
        return <>
            <ResponsiveContainer width="99%" height="100%">
                <LineChart
                    data={props.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Time" strokeWidth={3} stroke={colorPalette.primary} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    }

    function ShowData() {
        if (showUI) {
            return ChartUI();
        }
        return EmptyUI();
    }

    return (<>{ShowData()}</>)
}

export default UsageTimeSpent