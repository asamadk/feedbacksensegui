
import React, { useEffect, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import FSTooltip from '../Components/FSTooltip';
import { getLineChartColor, handleUnAuth } from '../Utils/FeedbackUtils';
import { Box } from '@mui/material';

function UsageEventDetailChart({ data }: any) {

    const [eventOverTimeData, setEventsOverTimeData] = useState<any[]>([]);
    const [lines, setLines] = useState<string[]>([]);
    const [showUI, setShowUI] = useState(true);

    useEffect(() => {
        if (data == null || data.length < 1) {
            setShowUI(false);
        } else {
            transformDataForChart();
            setShowUI(true);
        }
    }, [data]);

    function transformDataForChart() {
        const eventList = new Set<string>();
        const eventsByDate: any = {};
        data?.forEach((event: any) => {
            const date = new Date(event.createdDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
            const eventName = event.eventName.toLowerCase();
            if (!eventsByDate[date]) {
                eventsByDate[date] = {};
            }
            if (!eventsByDate[date][eventName]) {
                eventsByDate[date][eventName] = 0;
            }
            eventsByDate[date][eventName]++;
            eventList.add(eventName)
        });

        // Step 2: Construct the final array
        const finalArray = [];
        for (const date in eventsByDate) {
            const eventData = { name: date };
            Object.assign(eventData, eventsByDate[date]);
            finalArray.push(eventData);
        }

        setEventsOverTimeData(unifyKeys(finalArray));
        setLines(Array.from(eventList));
    }

    function unifyKeys(originalData: any[]) {
        const allKeys = new Set<string>();
        originalData.forEach(obj => {
            Object.keys(obj).forEach(key => allKeys.add(key));
        });

        return  originalData.map(obj => {
            const newObj: { [key: string]: number } = { name: obj.name }; // Ensure 'name' key is always present
            allKeys.forEach(key => {
                newObj[key] = obj[key] || 0;
            });
            return newObj;
        });
    }

    function EmptyUI() {
        return <Box height={300} >
            <img style={{height : '100%',width : '100%',margin : 'auto'}} src='/no-data.svg' alt='No Data'/>
        </Box>
    }

    function ChartUI() {
        return <>
        <ResponsiveContainer width="99%" height="100%">
            <LineChart
                data={eventOverTimeData}
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
                <Legend layout="vertical" verticalAlign="top" align="right" />
                {
                    lines?.map((line, index) =>
                        <Line type="monotone" dataKey={line} strokeWidth={2} stroke={getLineChartColor(index)} />
                    )
                }
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

export default UsageEventDetailChart