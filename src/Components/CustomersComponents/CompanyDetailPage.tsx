import { Box, Button, IconButton, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { containedButton, outlinedBlackButton, outlinedButton } from '../../Styles/ButtonStyle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colorPalette } from '../../Utils/Constants';
import CompanyDetailTab from './CompanyDetailTab';
import CompanyCommTab from './CompanyCommTab';
import CompanyUsageTab from './CompanyUsageTab';
import CompanyPeopleTab from './CompanyPeopleTab';
import CompanyTaskTab from './CompanyTaskTab';
import CompanyNotesTab from './CompanyNotesTab';
import CompanyActivityTab from './CompanyActivityTab';
import CompanyTicketTab from './CompanyTicketTab';
import CompanySurveyTab from './CompanySurveytab';
import { useLocation, useNavigate } from 'react-router';
import CloseIcon from '@mui/icons-material/Close';
import RowingIcon from '@mui/icons-material/Rowing';

function CompanyDetailPage() {

    const snackbarRef: any = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [value, setValue] = useState('details');
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(location.state);

    useEffect(() => {
        setCompany(location.state);
    }, [location.state]);

    const ShowTabPage = () => {
        if (value === 'details') {
            return <CompanyDetailTab company={company} />
        } else if (value === 'communication') {
            return <CompanyCommTab />
        } else if (value === 'usage') {
            return <CompanyUsageTab />
        } else if (value === 'people') {
            return <CompanyPeopleTab />
        } else if (value === 'task') {
            return <CompanyTaskTab companyId={company.id} />
        } else if (value === 'notes') {
            return <CompanyNotesTab />
        } else if (value === 'activity') {
            return <CompanyActivityTab />
        } else if (value === 'tickets') {
            return <CompanyTicketTab />
        } else if (value === 'survey') {
            return <CompanySurveyTab />
        }
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', padding: '10px', justifyContent: 'space-between', background: colorPalette.secondary }} >
                <Box sx={{ display: 'flex' }} >
                    <Box sx={{ background: '#7ACB36', width: '12px', height: '12px', borderRadius: '50%', marginTop: '10px' }} ></Box>
                    <Box textAlign={'start'} marginLeft={'20px'} >
                        <Typography marginLeft={'5px'} variant='h5' fontWeight={600} >
                            {company.name}
                        </Typography>
                        <Typography sx={{ textAlign: 'start', fontSize: '14px', color: colorPalette.fsGray }} >{company.id}</Typography>
                    </Box>
                </Box>
                <Box display={'flex'} >
                    <Box sx={{ marginTop: '7px' }} >
                        {/* <QuickActions /> */}
                        <Button
                            startIcon={<RowingIcon />}
                            sx={{ ...containedButton, marginTop: '0px' }}
                            variant='contained'
                        >Activities</Button>
                    </Box>
                    <IconButton onClick={() => (navigate(-1))} sx={{ width: '50px', marginLeft: '10px' }} >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <MultiTab value={(data: string) => setValue(data)} />
            <Box>{ShowTabPage()}</Box>
        </Box>
    )
}

export default CompanyDetailPage

function MultiTab(props: any) {

    const [value, setValue] = React.useState('details');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        props.value(newValue);
    };

    return (
        <Box sx={{ width: '100%', background: colorPalette.textSecondary }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="details" label="Details" />
                <Tab value="communication" label="Communication" />
                {/* <Tab value="usage" label="Usage" /> */}
                <Tab value="people" label="People" />
                <Tab value="task" label="Tasks" />
                <Tab value="notes" label="Notes" />
                <Tab value="activity" label="Activity" />
                {/* <Tab value="tickets" label="Tickets" /> */}
                <Tab value="survey" label="Survey Responses" />
            </Tabs>
        </Box>
    )
}

function QuickActions() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ ...containedButton, marginTop: 0 }}
                endIcon={<ExpandMoreIcon />}
            >
                Quick Actions
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
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
        </>
    )
}