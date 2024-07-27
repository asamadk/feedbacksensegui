import { Box, Button, Checkbox, Grid, IconButton, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography, styled } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react'
import { containedButton, outlinedButton } from '../../Styles/ButtonStyle';
import { colorPalette } from '../../Utils/Constants';
import { muiSelectStyle, textFieldStyle } from '../../Styles/InputStyles';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import { useNavigate } from 'react-router';
import { handleUnAuth } from '../../Utils/FeedbackUtils';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Redux/Reducers/LoadingReducer';
import DataArrayIcon from '@mui/icons-material/DataArray';
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

function FlowDashboard(props: { type: 'flows' | 'templates', mode: 'publish' | 'draft' }) {

    const navigate = useNavigate();
    const dispatch = useDispatch<any>();

    const [typeFilter, setTypeFilter] = useState('all');
    const [modeFilter, setModeFilter] = useState<'publish' | 'unpublish'>('publish');
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState<'flows' | 'templates'>(props.type);
    const [flows, setFlows] = useState<any[]>([]);
    const [unfilteredFlows, setUnfilteredFlows] = useState<any[]>([]);

    let init = false;

    useEffect(() => {
        if (props.mode === 'draft') {
            setModeFilter('unpublish');
        } else {
            setModeFilter('publish');
        }
        if (init === false) {
            setType(props.type);
            fetchFlows();
            init = true;
        }
    }, []);

    useEffect(() => {
        handleFilters();
    }, [typeFilter, modeFilter]);

    async function fetchFlows() {
        try {
            dispatch(setLoader(true));
            const { data } = await axios.get(endpoints.flows.get, { withCredentials: true });
            if (data.data) {
                setFlows(data.data);
                setUnfilteredFlows(data.data);
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
            if (val === 'publish') {
                navigate('/flows/publish');
            } else {
                navigate('/flows/draft');
            }
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
            >
                <ToggleButton value="publish">Published</ToggleButton>
                <ToggleButton value="unpublish">Unpublished</ToggleButton>
            </ToggleButtonGroup>
        )
    }

    function WorkflowBlock(flow: any) {
        const blockStyle = {
            padding: '10px',
            margin: '10px',
            border: `1px ${props.mode === 'publish' ? '#CBF0CB' : colorPalette.secondary}  solid`,
            borderRadius: '10px',
            minWidth: '250px',
            background: props.mode === 'publish' ? '#CBF0CB' : '#F6F6F6',
            cursor: 'pointer',
            textAlign : 'center'
        }

        const subColor = props.mode === 'publish' ? '#008000' : colorPalette.fsGray

        return (
            <Box onClick={() => handleFlowOpen(flow.id)} sx={blockStyle} >
                <Typography textAlign={'start'} >{flow.name}</Typography>
                <Typography textAlign={'start'} color={subColor} fontSize={'small'} >
                    <DataArrayIcon sx={{ position: 'relative', top: '4px' }} fontSize='small' /> 
                    {flow.type}
                </Typography>
                <Typography textAlign={'start'} color={subColor} fontSize={'small'} >
                    <PersonIcon sx={{ position: 'relative', top: '4px' }} fontSize='small' />
                    {flow.user.name}
                </Typography>
                <Typography textAlign={'start'} color={subColor} fontSize={'small'} >
                    <LanguageIcon sx={{ position: 'relative', top: '4px' }} fontSize='small' /> 
                    {new Date(flow.createdAt).toDateString()}
                </Typography>
            </Box>
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
                <Box sx={{ padding: '10px 20px', display: 'flex', flexWrap: 'wrap'}} >
                    {flows.map(flow => WorkflowBlock(flow))}
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