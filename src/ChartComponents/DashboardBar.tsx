import React from 'react'
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function DashboardBar(props: { data: any[], color: string,dataKey :string }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={props.data}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                    cursor={{ fill: 'none' }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '10px', fontSize: '14px' }}
                />
                <Legend />
                <Bar barSize={40} dataKey={props.dataKey} fill={props.color} />
            </BarChart>
        </ResponsiveContainer>
    )
}

export default DashboardBar