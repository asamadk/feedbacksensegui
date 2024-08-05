import { Badge, Box, Button, ButtonGroup, Chip, Divider, IconButton, Menu, MenuItem, Select, SpeedDial, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import OverAllResultChart from './OverAllResults/OverAllResultChart';
import OverAllMetrics from './OverAllResults/OverAllMetrics';
import DynamicCompOverallRes from './OverAllResults/DynamicCompOverallRes';
import EmptyAnalysis from './OverAllResults/EmptyAnalysis';
import { containedButton, transparentBlueTextButton, transparentButton } from '../Styles/ButtonStyle';
import { exportSurveyCsvAPI, exportSurveyJsonAPI } from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from './FSLoader';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getDurationLabel, getTwelveMonthAgoDate, handleLogout, parseDataType } from '../Utils/FeedbackUtils';
import Notification from '../Utils/Notification';
import { useSelector } from 'react-redux';
import { EXPORT_FEATURE } from '../Utils/CustomSettingsConst';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import DateRangeModal from '../Modals/DateRangeModal';
import { FilterCondition, durationType } from '../Utils/types';
import TuneIcon from '@mui/icons-material/Tune';
import AnalysisFiltersModal from '../Modals/AnalysisFiltersModal';

type IndividualResponseProps = {
    surveyId: string
}

const containerStyle = {
    paddingTop: '5px',
    paddingLeft: '10px',
    height: '48px',
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: '10px',
    paddingBottom: '10px'
}

function OverAllResult(props: IndividualResponseProps) {

    const settings = useSelector((state: any) => state.settings);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [loading, setLoading] = React.useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [openDateModal, setOpenDateModal] = useState(false);
    const [selectedFilters,setSelectedFilters] = useState(0);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [filterData, setFilterData] = useState<FilterCondition[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<durationType>({
        duration: 'last_12_months',
        startDate: getTwelveMonthAgoDate(),
        endDate: new Date().toLocaleDateString('en-US')
    });

    const open = Boolean(anchorEl);
    const snackbarRef: any = useRef(null);
    let init = false;

    useEffect(() => {
        if (init === false) {
            handleVisibility();
            init = true;
        }
    }, []);

    const handleVisibility = () => {
        if (parseDataType(settings[EXPORT_FEATURE]) === false) {
            setShowUpgrade(true);
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (showUpgrade === true) {
            snackbarRef?.current?.show('Please upgrade your plan to export survey data.', 'error');
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadCSV = (data: string, name: string, type: 'text/csv' | 'application/json') => {
        const blob = new Blob([data], { type: type });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
    };

    const handleCSVExport = async () => {
        handleClose();
        try {
            setLoading(true);
            const { data } = await axios.get(exportSurveyCsvAPI(props.surveyId), { withCredentials: true });
            if (data?.data?.result != null) {
                downloadCSV(
                    data?.data?.result,
                    data?.data?.name,
                    'text/csv'
                );
            }
            setLoading(false);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handlePDFExport = () => {
        handleClose();
    }

    const handleJSONExport = async () => {
        handleClose();
        try {
            setLoading(true);
            const { data } = await axios.get(exportSurveyJsonAPI(props.surveyId), { withCredentials: true });
            if (data?.data?.result != null) {
                downloadCSV(
                    JSON.stringify(data?.data?.result, null, 2),
                    data?.data?.name,
                    'application/json'
                );
            }
            setLoading(false);
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleDurationChange = (duration: string, startTime: string, endTime: string) => {
        const tmpDuration: durationType = {
            duration: duration,
            startDate: startTime,
            endDate: endTime
        }
        setSelectedDuration(tmpDuration);
        setIsEmpty(false);
    }

    const handleApplyFilter = (tmpFilterData : FilterCondition[]) => {
        const filterCount = tmpFilterData.length;
        setSelectedFilters(filterCount);
        setFilterData(tmpFilterData)
    }

    const ExportHandler = () => {
        return (
            <>
                <Box >
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ marginTop: '5px' }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleCSVExport}>Export CSV</MenuItem>
                        {/* <MenuItem onClick={handlePDFExport}>Export PDF</MenuItem> */}
                        <MenuItem onClick={handleJSONExport}>Export JSON</MenuItem>
                    </Menu>
                </Box>
            </>
        )
    }

    const FilterHandler = () => {

        return (
            <>
                <Box marginTop={'8px'} marginRight={'10px'}>
                    <Button onClick={() => { setOpenDateModal(true) }} sx={transparentBlueTextButton} >
                        <b style={{ marginRight: '8px' }} >{getDurationLabel(selectedDuration.duration)}</b>
                        {' ' + new Date(selectedDuration.startDate).toDateString()} - {new Date(selectedDuration.endDate).toDateString()}
                        <ExpandCircleDownIcon sx={{ marginLeft: '10px' }} />
                    </Button>
                </Box>
                <Box marginRight={'20px'} >
                <Tooltip title={selectedFilters > 0 ? `${selectedFilters} filter(s) selected` : ''} >
                    <Badge anchorOrigin={{vertical: 'bottom',horizontal: 'right',}} badgeContent={selectedFilters} color="error">
                        <Button
                            onClick={() => {setOpenFilterModal(true)}}
                            size='small'
                            variant='contained'
                            sx={containedButton}
                            startIcon={<TuneIcon />}
                        >
                            More Filter
                        </Button>
                    </Badge>
                </Tooltip>
                </Box>
            </>
        )
    }

    return (
        <Box height={'calc(100vh - 100px)'} sx={{ overflowY: 'scroll',background : colorPalette.textSecondary }} >
            <Box sx={containerStyle} >
                <Typography
                    paddingTop={'15px'}
                    paddingLeft={'10px'}
                    fontSize={'14px'}
                    fontWeight={'600'}
                    color={colorPalette.darkBackground} >
                    {'Overall Result'}
                </Typography>
                <Box display={'flex'} >
                    {FilterHandler()}
                    {ExportHandler()}
                </Box>
            </Box>
            {
                isEmpty === false && filterData.length < 1 &&
                <OverAllResultChart
                    dateFilter={selectedDuration}
                    empty={() => setIsEmpty(true)}
                    notEmpty={() => setIsEmpty(false)}
                    surveyId={props.surveyId}
                />
            }
            {
                isEmpty === false && filterData.length < 1 &&
                <OverAllMetrics
                    surveyId={props.surveyId}
                    dateFilter={selectedDuration}
                />
            }
            {
                isEmpty === false &&
                <DynamicCompOverallRes
                    surveyId={props.surveyId}
                    dateFilter={selectedDuration}
                    filterPayload={filterData}
                />
            }
            {isEmpty === true && <EmptyAnalysis />}
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
            {
                openDateModal &&
                <DateRangeModal
                    open={openDateModal}
                    close={() => setOpenDateModal(false)}
                    duration={selectedDuration.duration}
                    startDate={selectedDuration.startDate}
                    endDate={selectedDuration.endDate}
                    update={handleDurationChange}
                />
            }
            {
                openFilterModal &&
                <AnalysisFiltersModal
                    open={openFilterModal}
                    close={() => setOpenFilterModal(false)}
                    update={handleApplyFilter}
                    data={filterData}
                    surveyId={props.surveyId}
                />
            }
        </Box>
    )
}

export default OverAllResult