import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

function DashboardDoughnut(props: { data: any[], colors: string[] }) {

    const [showUI, setShowUI] = useState(true);

    function areAllValuesZero(objArr :any[]) {
        let res = true;
        objArr.forEach(d => {
            if(d.value !== 0){res = false;}
        });
        return res;
    }

    useEffect(() => {
        if (props.data == null || props.data.length < 1 || areAllValuesZero(props.data)) {
            setShowUI(false);
        } else {
            setShowUI(true);
        }
    }, [props.data]);

    function EmptyUI() {
        return <Box height={110} >
            <img style={{ height: '100%', width: '100%', margin: 'auto' }} src='/no-data.svg' alt='No Data' />
        </Box>
    }

    function ShowData() {
        if (showUI) {
            return ChartUI();
        }
        return EmptyUI();
    }

    function ChartUI() {
        return <>
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
        </>
    }

    return (
        <>{ShowData()}</>
    )
}

export default DashboardDoughnut;
