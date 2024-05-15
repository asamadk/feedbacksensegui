import { Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import FSLoader from '../Components/FSLoader'
import Notification from '../Utils/Notification';
import { globalSettingSubContainers } from '../Styles/LayoutStyles';
import { colorPalette } from '../Utils/Constants';
import { tableContainerStyle, tableCellStyle, tableVerticalBorder } from '../Styles/TableStyle';
import HealthConditionComponent from '../Components/CustomersComponents/HealthConditionComponent';
import { outlinedButton, containedButton, getOutlinedButtonBG } from '../Styles/ButtonStyle';
import AddIcon from '@mui/icons-material/Add';
import InfoComponent from '../Components/InfoComponent';
import axios from 'axios';
import { createHealthConfigURL, getHealthConfigURL } from '../Utils/Endpoints';
import { handleUnAuth } from '../Utils/FeedbackUtils';
import ReplayIcon from '@mui/icons-material/Replay';
import { healthScoreMetrics } from '../Utils/ConditionConstants';

type rowType = {
    metric: string,
    metricInfo : any,
    good: {
        operator: string,
        value: any
    },
    poor: {
        operator: string,
        value: any
    }
}

function HealthDesignerLayout() {

    const snackbarRef: any = useRef(null);
    const [loading, setLoading] = useState(false);
    const [col, setCol] = useState<string[]>(['Metric', 'Good Health Criteria', 'Poor Health Criteria']);
    const [rows, setRows] = useState<rowType[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [healthData, setHealthData] = useState<any>({});

    function handleAddCriteria() {
        setRows([...rows, { metric: '',metricInfo : {}, good: { operator: '', value: '' }, poor: { operator: '', value: '' } }]);
    }

    let init = false;
    useEffect(() => {
        if (init === false) {
            fetchHealthCriteria();
            init = true;
        }
    }, []);

    async function fetchHealthCriteria() {
        try {
            setLoading(true);
            const { data } = await axios.get(getHealthConfigURL(), { withCredentials: true });
            if (data.data) {
                setHealthData(data.data);
                if (data?.data?.config) {
                    setRows(JSON.parse(data?.data?.config));
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            handleUnAuth(error);
        }
    }

    // Function to handle metric change
    function handleMetricChange(val: any, index: number) {
        let metricInfo :any= {};
        healthScoreMetrics.forEach(m => {
            if(m.value === val){
                metricInfo = m;
            }
        })
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index].metric = val;
            updatedRows[index].metricInfo = metricInfo;
            return updatedRows;
        });
    }

    // Function to handle operator change
    function handleOperatorChange(val: any, index: number, type: 'good' | 'poor') {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index][type].operator = val;
            return updatedRows;
        });
    }

    // Function to handle value change
    function handleValueChange(val: any, index: number, type: 'good' | 'poor') {
        setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index][type].value = val;
            return updatedRows;
        });
    }

    function handleCancel() {
        setEditMode(false);
        fetchHealthCriteria();
    }

    async function handleSave() {
        try {
            if (!validatePayload(rows)) { return; }
            const payload = {
                config: JSON.stringify(rows),
                id: healthData.id
            }
            await axios.post(createHealthConfigURL(), payload, { withCredentials: true });
            snackbarRef?.current?.show('Health Updated', 'success');
            setEditMode(false);
        } catch (error) {
            snackbarRef?.current?.show('Something went wrong', 'error');
            setLoading(false);
            handleUnAuth(error);
        }
    }

    function validatePayload(dataArr: rowType[]): boolean {
        if (dataArr.length > 10) {
            snackbarRef?.current?.show('Please contact support to add more than 10 metrics', 'error');
            return false;
        }
        for (let i = 0; i < dataArr.length; i++) {
            const data = dataArr[i];
            if (
                data.metric == null || data.metric.length < 1 ||
                data.good.operator == null || data.good.operator.length < 1 ||
                data.good.value == null || data?.good?.value?.length < 1 ||
                data.poor.value == null || data?.poor?.value?.length < 1 ||
                data.poor.operator == null || data.poor.operator.length < 1
            ) {
                snackbarRef?.current?.show('Please fill all the values', 'warning');
                return false;
            }
        }
        return true;
    }

    async function recalculateHealthScore() {
        try {
            setLoading(true);
            //TODO run API to recalculate health score
            snackbarRef?.current?.show('Health Score will be updated soon', 'success');
            setLoading(false);
        } catch (error) {
            snackbarRef?.current?.show('Something went wrong', 'error');
            setLoading(false);
            handleUnAuth(error);
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box display={'flex'} justifyContent={'space-between'} width={'100%'} textAlign={'start'} marginLeft={'5px'}>
                    <Box>
                        <Typography variant='h5' >
                            Health Designer
                        </Typography>
                        <Typography sx={{ fontSize: '15px', marginBottom: '10px' }} >Customize how health score is calculated for your companies</Typography>
                    </Box>
                    {/* <Box>
                        <Button onClick={recalculateHealthScore} endIcon={<ReplayIcon />} sx={getOutlinedButtonBG(colorPalette.textSecondary)} >
                            Recalculate Health Score
                        </Button>
                    </Box> */}
                </Box>
            </Box>
            <Box sx={{ ...globalSettingSubContainers('#ffffff'), height: 'calc(100vh - 140px)', textAlign: 'center', overflowY: 'scroll' }} >
                <Box sx={{ textAlign: 'end', marginBottom: '10px' }} >
                    {
                        !editMode &&
                        <Button
                            sx={{ ...containedButton, width: 'fit-content' }}
                            size='small'
                            onClick={() => setEditMode(true)}
                        >Edit</Button>
                    }
                    {
                        editMode &&
                        <>
                            <Button
                                onClick={handleSave}
                                sx={{ ...containedButton, width: 'fit-content' }}
                                size='small'
                            >Save</Button>
                            <Button
                                sx={{ ...outlinedButton, width: 'fit-content', marginLeft: '5px' }}
                                size='small'
                                onClick={handleCancel}
                            >Cancel</Button>
                        </>
                    }
                </Box>
                <TableContainer sx={tableContainerStyle} >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead >
                            <TableRow >
                                {col?.map((column: string) => (
                                    <TableCell
                                        sx={
                                            {
                                                ...tableVerticalBorder,
                                                fontWeight: '600',
                                                backgroundColor: column.includes('Good') ? '#f5faf5' : column.includes('Poor') ? '#fff3f3' : '',
                                                color: column.includes('Good') ? '#008000' : column.includes('Poor') ? '#ff0000' : '',
                                                textAlign: 'center'
                                            }
                                        }
                                        key={column}
                                    >
                                        <Box display={'flex'} sx={{ justifyContent: 'center' }} >
                                            <Typography>{column}</Typography>
                                            <Box sx={{ marginTop: '2px', marginLeft: '5px' }} >
                                                {
                                                    (column.includes('Good') || column.includes('Poor')) &&
                                                    <InfoComponent
                                                        color=''
                                                        message={
                                                            column.includes('Good') ?
                                                                'If All good criteria are satisfied then company is in good health' :
                                                                'If any one of poor criteria is satisfied then company is in poor health'
                                                        }
                                                    />
                                                }
                                            </Box>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                rows?.map((row, index) => (
                                    <TableRow key={row?.metric} >
                                        <TableCell sx={{ ...tableVerticalBorder }} >
                                            <HealthConditionComponent
                                                disabled={!editMode}
                                                type='metric'
                                                metric={row?.metric}
                                                operator={''}
                                                value={''}
                                                onMetricChange={(val: any) => handleMetricChange(val, index)}
                                                onOperatorChange={() => { }}
                                                onValueChange={() => { }}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ ...tableVerticalBorder, background: '#f5faf5' }} >
                                            <HealthConditionComponent
                                                disabled={!editMode}
                                                type='non-metric'
                                                metric={row?.metric}
                                                operator={row?.good?.operator}
                                                value={row?.good?.value}
                                                onMetricChange={() => { }}
                                                onOperatorChange={(val: any) => handleOperatorChange(val, index, 'good')}
                                                onValueChange={(val: any) => handleValueChange(val, index, 'good')}
                                            />
                                        </TableCell>
                                        <TableCell sx={{ background: '#fff3f3' }} >
                                            <HealthConditionComponent
                                                disabled={!editMode}
                                                type='non-metric'
                                                metric={row?.metric}
                                                operator={row.poor?.operator}
                                                value={row?.poor?.value}
                                                onMetricChange={() => { }}
                                                onOperatorChange={(val: any) => handleOperatorChange(val, index, 'poor')}
                                                onValueChange={(val: any) => handleValueChange(val, index, 'poor')}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button disabled={!editMode} onClick={handleAddCriteria} startIcon={<AddIcon />} sx={outlinedButton} >
                    Add Criteria
                </Button>

                <Box marginTop={'20px'} textAlign={'start'} >
                    <Box display={'flex'} >
                        <Box sx={{ marginTop: '10px', marginRight: '10px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#FFA500' }} ></Box>
                        <Box>
                            <Typography variant='h6' fontWeight={600}>Average Health</Typography>
                            <Typography>
                                If neither good nor bad criteria are satisfied then company is in average health
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} >
                        <Box sx={{ marginTop: '10px', marginRight: '10px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#008000' }} ></Box>
                        <Box>
                            <Typography variant='h6' fontWeight={600}>Good Health</Typography>
                            <Typography>
                                If All good criteria are satisfied then company is in good health
                            </Typography>
                        </Box>
                    </Box>
                    <Box display={'flex'} >
                        <Box sx={{ marginTop: '10px', marginRight: '10px', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: '#ff0000' }} ></Box>
                        <Box>
                            <Typography variant='h6' fontWeight={600}>Poor Health</Typography>
                            <Typography>
                                If any poor criteria is satisfied then company is in poor health
                            </Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default HealthDesignerLayout