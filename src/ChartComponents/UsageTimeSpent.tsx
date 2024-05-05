import React from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getLineChartColor } from '../Utils/FeedbackUtils';

function UsageTimeSpent(props : any) {

    return (
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
                {/* <CartesianGrid vertical={false} strokeDasharray="0" /> */}
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip/>
                <Line type="monotone" dataKey="Time" strokeWidth={3} stroke={getLineChartColor(6)} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default UsageTimeSpent