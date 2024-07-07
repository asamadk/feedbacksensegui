import { Box, Button, Checkbox, Grid, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup, styled } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { colorPalette } from '../../Utils/Constants';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import SearchIcon from '@mui/icons-material/Search';
import FlowBlock from '../FlowBlock';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FlowTemplateBlockComponent from '../FlowTemplateBlockComponent';
import { paginationStyle, tableCellStyle, tableContainerStyle } from '../../Styles/TableStyle';
import CustomChip from '../CustomChip';
import { taskStatusStyle } from '../../Styles/LayoutStyles';
import { useNavigate } from 'react-router';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Redux/Reducers/LoadingReducer';
import axios from 'axios';
import { endpoints } from '../../Utils/Endpoints';
import CreateFlowModal from '../../FlowComponents/CreateFlowModal';
import { updateCurrentWorkflow } from '../../Redux/Actions/currentWorkflowActions';

const CssTextField = styled(TextField)(textFieldStyle);
const CustomSelect = styled(Select)(muiSelectStyle);

const headerContainer = {
    borderBottom: `1px ${colorPalette.textSecondary} solid`,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0px 20px'
}

const bodyContainer = {
    overflowY: 'scroll',
    height: 'calc(100vh - 111px)',
}

function FlowDashboard(props: { type: 'flows' | 'templates' }) {

    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

    const [typeFilter, setTypeFilter] = useState('all');
    const [modeFilter, setModeFilter] = useState<'publish' | 'unpublish'>('publish');
    const [searchStr, setSearchStr] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState<'flows' | 'templates'>(props.type);
    const [flows, setFlows] = useState<any[]>([]);
    const [unfilteredFlows, setUnfilteredFlows] = useState<any[]>([]);
    const [templates, setTemplates] = useState([1, 2, 3, 4, 5]);

    let init = false;

    useEffect(() => {
        if (init === false) {
            setType(props.type);
            fetchFlows();
            init = true;
        }
    }, [props.type]);

    useEffect(() => {
        handleFilters();
    }, [typeFilter, searchStr,modeFilter]);

    async function fetchFlows() {
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.flows.get, { withCredentials: true });
            if (data.data) {
                setFlows(data.data);
                setUnfilteredFlows(data.data);
                setModeFilter('unpublish');
            }
            dispatch(setLoader(false));
        } catch (error) {
            dispatch(setLoader(false));
            handleUnAuth(error);
        }
    }

    function handleFlowOpen(flowId: string) {
        dispatch(updateCurrentWorkflow(flowId));
        navigate(`/flow/detail/create/${flowId}`);
    }

    function handleModalClose(data: { refresh: boolean }) {
        setShowModal(false);
        if (data.refresh === true) { fetchFlows(); }
    }

    // function handleFilters() {
    //     const filteredData: any[] = [];
    //     unfilteredFlows.forEach(fl => {

    //         //Filtered by type
    //         if (typeFilter != null && typeFilter !== 'all' && typeFilter.length > 0) {
    //             if (fl.type === typeFilter) {
    //                 filteredData.push(fl);
    //             }
    //         } else if (typeFilter === 'all') {
    //             filteredData.push(fl);
    //         }
    //     });

    //     setFlows(filteredData);
    // }

    function handleFilters() {
        const filteredData: any[] = [];
        unfilteredFlows.forEach(fl => {
            // Filter by type
            const typeCondition = (typeFilter != null && typeFilter !== 'all' && typeFilter.length > 0)
                ? fl.type === typeFilter
                : typeFilter === 'all';
    
            // Filter by publish/unpublish
            const modeCondition = (modeFilter === 'publish')
                ? fl.is_published === true
                : fl.is_published === false;
    
            // Apply both filters in an AND condition
            if (typeCondition && modeCondition) {
                filteredData.push(fl);
            }
        });
    
        setFlows(filteredData);
    }
    

    function handleModeFilter(e: any, val: 'publish' | 'unpublish') {
        if (val != null && val?.length > 0) {
            setModeFilter(val);
        }
    }

    function toggleFilter() {
        return (
            <ToggleButtonGroup
                color='secondary'
                value={modeFilter}
                exclusive
                sx={{ height: '40px', marginRight: '10px' }}
                onChange={handleModeFilter}
            // aria-label="Platform"
            >
                <ToggleButton value="publish">Published</ToggleButton>
                <ToggleButton value="unpublish">Unpublished</ToggleButton>
            </ToggleButtonGroup>
        )
    }

    return (
        <Box>
            <Box sx={headerContainer} >
                <Box sx={{ marginTop: '10px' }} >
                    {toggleFilter()}
                    <CustomSelect
                        sx={{ width: '130px' }}
                        size='small'
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as string)}
                    >
                        <MenuItem value='all' >All</MenuItem>
                        <MenuItem value='company' >Companies</MenuItem>
                        <MenuItem value='person' >Person</MenuItem>
                        <MenuItem value='task' >Tasks</MenuItem>
                    </CustomSelect>
                </Box>
                <Box>
                    {/* <CssTextField
                        size='small'
                        value={searchStr}
                        onChange={(e) => setSearchStr(e.target.value)}
                        sx={{ input: { color: colorPalette.darkBackground }, marginTop: '10px' }}
                        placeholder={`Search ${props.type}`}
                        InputProps={{
                            endAdornment: <SearchIcon sx={{ color: colorPalette.darkBackground, paddingLeft: '5px' }} />
                        }}
                    /> */}
                    {
                        type === 'flows' &&
                        <Button
                            className='create-new-survey-button'
                            sx={containedButton}
                            style={{ width: 'fit-content', marginBottom: '15px', marginLeft: '10px', textTransform: 'none' }}
                            startIcon={<AddIcon />}
                            onClick={() => setShowModal(true)}
                            variant='contained'
                        >
                            Create Flows
                        </Button>
                    }
                </Box>
            </Box>
            <Box sx={bodyContainer} >
                <Box sx={{ padding: '10px 20px' }} >
                    <TableContainer id='company-table-container' sx={{ ...tableContainerStyle, height: 'calc(100vh - 145px)', marginTop: '10px' }} >
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead sx={{ background: colorPalette.textSecondary }} >
                                <TableRow >
                                    <TableCell sx={{ ...tableCellStyle, fontWeight: 600, padding: '10px 20px' }} >
                                        {/* {props.type === 'flows' && <Checkbox color='secondary' />} */}
                                        Name
                                    </TableCell>
                                    {
                                        props.type === 'templates' &&
                                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600 }}  >Description</TableCell>
                                    }
                                    {
                                        props.type === 'flows' &&
                                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}  >Created At</TableCell>
                                    }
                                    {
                                        props.type === 'flows' &&
                                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}  >Created By</TableCell>
                                    }
                                    <TableCell sx={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}  >Type</TableCell>
                                    {
                                        props.type === 'flows' &&
                                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}  >Mode</TableCell>
                                    }
                                    <TableCell sx={{ ...tableCellStyle, fontWeight: 600, textAlign: 'center' }}  >Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    flows.map(flow => (
                                        <TableRow key={flow} >
                                            <TableCell sx={{ ...tableCellStyle, padding: '20px' }} >
                                                {/* {props.type === 'flows' && <Checkbox color='secondary' />} */}
                                                <b >{flow.name}</b>
                                            </TableCell>
                                            {
                                                props.type === 'templates' &&
                                                <TableCell sx={{ ...tableCellStyle }} >
                                                    Description
                                                </TableCell>
                                            }
                                            {
                                                props.type === 'flows' &&
                                                <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }} >
                                                    {new Date(flow.createdAt).toDateString()}
                                                </TableCell>
                                            }
                                            {
                                                props.type === 'flows' &&
                                                <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }} >
                                                    {flow.user.name}
                                                </TableCell>
                                            }
                                            <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }} >
                                                <Box sx={{ ...taskStatusStyle('Open'), margin: 'auto', width: '100px', textOverflow: 'ellipsis' }}>
                                                    {flow.type}
                                                </Box>
                                            </TableCell>
                                            {
                                                props.type === 'flows' &&
                                                <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }} >
                                                    <Box sx={{ width: '100px', margin: 'auto' }} >
                                                        <CustomChip status={flow.is_published === true ? 'success' : 'error'} />
                                                    </Box>
                                                </TableCell>
                                            }
                                            <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                                                <IconButton onClick={() => handleFlowOpen(flow.id)} size="small">
                                                    <ArrowForwardIosIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            {
                showModal &&
                <CreateFlowModal open={showModal} close={handleModalClose} />
            }
        </Box>
    )
}

export default FlowDashboard