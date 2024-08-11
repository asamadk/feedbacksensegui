import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { colorPalette } from '../../Utils/Constants';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { parseDataType } from '../../Utils/FeedbackUtils';
import { HEALTH_HISTORY } from '../../Utils/CustomSettingsConst';
import UpgradePlanError from '../UpgradePlanError';

const formatHealthText = (value: any) => {
    switch (value) {
        case 0: return 'Poor';
        case 50: return 'Average';
        case 100: return 'Good';
        default: return '';
    }
};

function CompanyDetailHealthScore({ data, loading }: { data: any[], loading: boolean }) {

    const settings = useSelector((state: any) => state.settings);

    const [showUI, setShowUI] = useState(true);
    const [visible, setVisible] = useState(true);


    useEffect(() => {
        if (data == null || data.length < 2) {
            setShowUI(false);
        } else {
            setShowUI(true);
        }
    }, [data]);

    useEffect(() => {
        handlePlanVisibility()
    }, []);

    const handlePlanVisibility = () => {
        if (settings != null && parseDataType(settings[HEALTH_HISTORY]) === true) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }

    function EmptyUI() {
        return <Box height={300} >
            <img style={{ height: '100%' }} src='/no-data.svg' alt='No Data' />
        </Box>
    }

    function ChartUI() {
        return <>
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
        </>
    }

    function ShowData() {
        if (visible) {
            if (!loading && showUI) {
                return ChartUI();
            }else{
                return EmptyUI();
            }
        } else {
            return (
                <UpgradePlanError
                    message='Upgrade plan to use health history'
                    desc='This feature is available in "Company" & "Enterprise" plans'
                    showButton={false}
                />
            )
        }
    }

    return (
        <>{ShowData()}</>
    );
}

export default CompanyDetailHealthScore;