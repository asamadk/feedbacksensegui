import { Box, Typography, Grid, Card, CardContent, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { colorPalette, monthOptions } from '../../Utils/Constants';
import DashboardBar from '../../ChartComponents/DashboardBar';

function chipStyle(selected: boolean) {
    return {
        border: `1px solid ${colorPalette.fsGray}`,
        width: 'fit-content',
        padding: '2px 10px',
        borderRadius: '10px',
        marginRight: '5px',
        cursor: 'pointer',
        background: selected ? colorPalette.secondary : colorPalette.background,
        color: selected ? colorPalette.primary : colorPalette.darkBackground
    }
}

const blockStyle = {
    borderRadius: '6px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    padding: '20px',
    textAlign: 'center',
    background: colorPalette.textSecondary,
    height: '110px'
}

const DashboardCompass = () => {

    const [filterType, setFilterType] = useState<'all' | 'my'>('all');
    const [dateFilter, setDateFilter] = useState(new Date().getMonth() + 1);
    const [yearFiler, setYearFilter] = useState(new Date().getFullYear());

    //   * Customer Churn % (monthly filter) [DONE]
    //   * Churn Revenue % (monthly filter) (How much is lost) [DONE]
    //   * Net MR Churn [DONE]
    //   * Expansion Revenue % [DONE]
    //     * Retention Rate [DONE]
    // * Ending ARR [DONE]
    //* At Risk ARR

    const netMrrChurn = [
        { month: 'Jan', churn: 1.5 },
        { month: 'Feb', churn: 2.5 },
        { month: 'Mar', churn: 1.0 },
        // Add more data points
    ];

    const expansionRevenue = [
        { month: 'Jan', revenue: 11 },
        { month: 'Feb', revenue: 3 },
        { month: 'Mar', revenue: 7 },
    ];

    return (
        <Box sx={{ height: 'calc(100vh - 68px)', padding: '10px 20px', overflowY: 'auto', textAlign: 'start' }} >
            <Typography variant='h6' fontWeight={600} >Revenue Compass</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box sx={{ display: 'flex', height: '25px', marginTop: '15px' }} >
                    <Typography sx={{ marginRight: '5px' }} >Companies</Typography>
                    <Box onClick={() => setFilterType('all')} sx={chipStyle(filterType === 'all')} >All</Box>
                    <Box onClick={() => setFilterType('my')} sx={chipStyle(filterType === 'my')} >My</Box>
                </Box>
                <Box>
                    <Select
                        onChange={(e) => setDateFilter(parseInt(e.target.value as string))}
                        value={dateFilter}
                        size='small'
                        sx={{ marginTop: '10px' }}
                    >
                        {monthOptions.map(d => <MenuItem value={d.value} >{d.label}</MenuItem>)}
                    </Select>
                    <Select
                        onChange={(e) => setYearFilter(parseInt(e.target.value as string))}
                        value={yearFiler}
                        size='small'
                        sx={{ marginTop: '10px', marginLeft: '10px' }}
                    >
                        {[new Date().getFullYear(), new Date().getFullYear() - 1].map(d => <MenuItem value={d} >{d}</MenuItem>)}
                    </Select>
                </Box>
            </Box>

            <Box marginTop={'20px'} textAlign={'start'} >
                <Grid container spacing={4} >
                    <Grid item xs={3} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Net Retention Rate</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                91.75%
                            </Typography>
                            <Typography fontSize={13} >For Selected Month</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Ending ARR</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                $304K
                            </Typography>
                            <Typography fontSize={13} >For Selected Month</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Customer Churned</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                7.4%
                            </Typography>
                            <Typography fontSize={13} >Lost Companies For Selected Month</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Revenue Lost</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                $35k
                            </Typography>
                            <Typography fontSize={13} >Lost due to churn for Selected Month</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid style={{ marginTop: '20px' }} container spacing={4} >
                    <Grid item xs={6} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Renewable</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                4
                            </Typography>
                            <Typography fontSize={13} >of <b>43</b> companies are in renewal</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >Renewable</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                $103K
                            </Typography>
                            <Typography fontSize={13} >of <b>1450K</b> (10% of ARR)</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={4} >
                    <Grid item xs={6} >
                        <Box sx={{ ...blockStyle, height: '300px' }} marginTop={'20px'} >
                            <Typography fontWeight={600} >Net MRR Churn</Typography>
                            <Typography fontSize={13} >For all Months</Typography>
                            <DashboardBar dataKey='churn' color={colorPalette.primary} data={netMrrChurn} />
                        </Box>
                    </Grid>
                    <Grid item xs={6} >
                        <Box sx={{ ...blockStyle, height: '300px' }} marginTop={'20px'} >
                            <Typography fontWeight={600} >Expansion Revenue</Typography>
                            <Typography fontSize={13} >For all Months</Typography>
                            <DashboardBar dataKey='revenue' color={colorPalette.primary} data={expansionRevenue} />
                        </Box>
                    </Grid>
                </Grid>

            </Box>

        </Box>
    );
};

export default DashboardCompass;
