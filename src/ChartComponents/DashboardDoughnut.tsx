import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function DashboardDoughnut(props: { data: any[],colors : string[] }) {

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={props.data}
                    innerRadius={30}
                    outerRadius={45}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                >
                    {props.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={props.colors[index % props.colors.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '10px', fontSize: '14px' }}
                />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '12px' }}
                    iconSize={10}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

export default DashboardDoughnut;
