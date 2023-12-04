import { Box, Button, ButtonGroup, Divider, Menu, MenuItem, SpeedDial, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import OverAllResultChart from './OverAllResults/OverAllResultChart';
import OverAllMetrics from './OverAllResults/OverAllMetrics';
import DynamicCompOverallRes from './OverAllResults/DynamicCompOverallRes';
import EmptyAnalysis from './OverAllResults/EmptyAnalysis';
import { containedButton } from '../Styles/ButtonStyle';
import { exportSurveyCsvAPI, exportSurveyJsonAPI } from '../Utils/Endpoints';
import axios from 'axios';
import FSLoader from './FSLoader';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import Notification from '../Utils/Notification';
import { useSelector } from 'react-redux';
import { EXPORT_FEATURE } from '../Utils/CustomSettingsConst';

type IndividualResponseProps = {
    surveyId: string
}

const containerStyle = {
    paddingTop: '5px',
    paddingLeft: '10px',
    borderBottom: '1px #454545 solid',
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
        if (settings[EXPORT_FEATURE] === 'false') {
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

    const ExportHandler = () => {
        return (
            <>
                <Box >
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={{ ...containedButton, width: '100px' }}
                    >
                        Export
                    </Button>
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

    return (
        <Box height={'calc(100vh - 100px)'} sx={{ overflowY: 'scroll' }} >
            <Box sx={containerStyle} >
                <Typography
                    paddingTop={'15px'}
                    paddingLeft={'10px'}
                    fontSize={'14px'}
                    fontWeight={'600'}
                    color={'#006DFF'} >
                    {'Overall Result'}
                </Typography>
                {ExportHandler()}
            </Box>
            {
                isEmpty === false &&
                <OverAllResultChart
                    empty={() => setIsEmpty(true)}
                    notEmpty={() => setIsEmpty(false)}
                    surveyId={props.surveyId}
                />
            }
            {isEmpty === false && <OverAllMetrics surveyId={props.surveyId} />}
            {isEmpty === false && <DynamicCompOverallRes surveyId={props.surveyId} />}
            {isEmpty === true && <EmptyAnalysis />}
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default OverAllResult