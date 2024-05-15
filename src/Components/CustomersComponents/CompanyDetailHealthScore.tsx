import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { colorPalette } from '../../Utils/Constants';

const formatHealthText = (value: any) => {
    switch (value) {
        case 0: return 'Poor';
        case 50: return 'Average';
        case 100: return 'Good';
        default: return '';
    }
};

function CompanyDetailHealthScore({ data, loading }: { data: any, loading: boolean }) {

    return (
        <>
            {
                !loading &&
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis
                            tickFormatter={formatHealthText}
                            domain={[0, 100]}
                        />
                        <Tooltip formatter={(value) => formatHealthText(value)} />
                        <Line type="monotone" dataKey="health" strokeWidth={3} stroke={colorPalette.primary} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            }
        </>
    );
}

export default CompanyDetailHealthScore;