import { Box, Typography, Grid, Card, CardContent, Select, MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { colorPalette, monthOptions } from '../../Utils/Constants';
import DashboardBar from '../../ChartComponents/DashboardBar';
import DashboardDoughnut from '../../ChartComponents/DashboardDoughnut';
import { overAllCustomerHealthColors } from '../../Utils/DashboardConstants';

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
        {
            value: '05/06/2024', Dashboard: 10, Login: 20, 'Add to Cart': 7,
        },
        {
            value: '15/06/2024', Dashboard: 15, Login: 12, 'Add to Cart': 10,
        },
        {
            value: '22/06/2024', Dashboard: 8, Login: 22, 'Add to Cart': 4,
        },
    ];

    const payingCustomers: any[] = [
        {
            "name": "Good",
            "value": 1
        },
        {
            "name": "Average",
            "value": 3
        },
        {
            "name": "Poor",
            "value": 0
        }
    ]

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
                            <Typography fontSize={13} fontWeight={600} >Net Retention Revenue</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                $140K
                            </Typography>
                            <Typography fontSize={13} >For Selected Month</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={3} >
                        <Box sx={blockStyle} >
                            <Typography fontSize={13} fontWeight={600} >New MRR</Typography>
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
                    <Grid item xs={9} >
                        <Box sx={{ ...blockStyle, height: '330px' }} >
                            <Typography textAlign={'start'} fontWeight={600} >Event Usage</Typography>
                            <DashboardBar
                                dataKeys={['Dashboard', 'Add to Cart', 'Login']}
                                colors={['#E9D3FF', colorPalette.primary, colorPalette.fsGray, colorPalette.darkBackground]}
                                data={netMrrChurn}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={3} >
                        <Box sx={{ ...blockStyle, height: '135px' }} >
                            <Typography fontSize={13} fontWeight={600} >Paying Customers</Typography>
                            <DashboardDoughnut colors={overAllCustomerHealthColors} data={payingCustomers} />
                            {/* <Typography fontSize={13} ><b>92%</b> are paying customers</Typography> */}
                        </Box>
                        <Box marginTop={'20px'} sx={{ ...blockStyle, height: '135px' }} >
                            <Typography fontSize={13} fontWeight={600} >New Paying Customers</Typography>
                            <Typography marginTop={'10px'} variant='h4' sx={{ color: colorPalette.primary }} fontWeight={600} >
                                116
                            </Typography>
                            <Typography fontSize={13} >New customers in June 2024</Typography>
                        </Box>
                    </Grid>
                </Grid>

            </Box>

        </Box>
    );
};

export default DashboardCompass;
