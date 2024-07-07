import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { colorPalette } from '../Utils/Constants'

function DashboardBar(props: { data: any[], colors: string[], dataKeys: string[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart margin={{top: 20, right: 30, left: 20, bottom: 5,}} data={props.data}>
                <CartesianGrid vertical={false} stroke={'#E9E9E9'} />
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip
                    cursor={{ fill: 'none' }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '10px', fontSize: '14px' }}
                />
                <Legend />
                {props.dataKeys.map((dataKey, index) => {
                    return (
                        <Bar
                            radius={[6, 6, 0, 0]}
                            barSize={40}
                            dataKey={dataKey}
                            fill={props.colors[index % props.colors.length]}
                        />
                    )
                })}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default DashboardBar