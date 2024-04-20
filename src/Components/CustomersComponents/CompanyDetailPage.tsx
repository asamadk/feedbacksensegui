import { Box, Button, IconButton, Menu, MenuItem, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import React, { SyntheticEvent, useEffect, useRef, useState } from 'react'
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
import CreateCompanyModal from '../../Modals/ContactModals/CreateCompanyModal';

function CompanyDetailPage() {

    const snackbarRef: any = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [value, setValue] = useState('details');
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState(location.state);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [openActivities, setOpenActivities] = useState(false);

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
            return <CompanyTaskTab personId={null} companyId={company.id} />
        } else if (value === 'notes') {
            return <CompanyNotesTab personId={null} companyId={company.id} />
        } else if (value === 'tickets') {
            return <CompanyTicketTab />
        } else if (value === 'survey') {
            return <CompanySurveyTab personId={null} companyId={company.id} />
        }
    }

    function handleCreateModalClose(data: any) {
        setShowCreateModal(false);
        console.log("🚀 ~ handleCreateModalClose ~ data:", data)
    }

    function handleEdit() {
        setShowCreateModal(true);
    }

    function handleActivities() {
        setOpenActivities(true);
    }

    function handleDelete() {
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
                    <Box marginTop={'7px'} >
                        <QuickActions
                            activities={handleActivities}
                            delete={handleDelete}
                            handleEdit={handleEdit}
                        />
                    </Box>
                    <IconButton onClick={() => (navigate(-1))} sx={{ width: '50px', marginLeft: '10px' }} >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>
            <MultiTab value={(data: string) => setValue(data)} />
            <Box>{ShowTabPage()}</Box>

            {
                openActivities &&
                <CompanyActivityTab companyId={company.id} open={openActivities} close={() => setOpenActivities(false)} />
            }
            {
                showCreateModal &&
                <CreateCompanyModal
                    data={company}
                    type='companies'
                    open={showCreateModal}
                    close={handleCreateModalClose}
                />
            }
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
                <Tab value="usage" label="Usage" />
                <Tab value="people" label="People" />
                <Tab value="task" label="Tasks" />
                <Tab value="notes" label="Notes" />
                <Tab value="tickets" label="Tickets" />
                <Tab value="survey" label="Survey Responses" />
            </Tabs>
        </Box>
    )
}

function QuickActions(props: { handleEdit: any, activities: any, delete: any }) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function handleEdit() {
        props.handleEdit();
        handleClose();
    }

    function handleActivities() {
        props.activities();
        handleClose();
    }

    function handleDelete() {
        props.delete();
        handleClose();
    }

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
                Actions
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
                <MenuItem onClick={handleEdit} id='edit' >Edit/Update</MenuItem>
                <MenuItem onClick={handleActivities} id='activities' >View Activities</MenuItem>
                {/* <MenuItem onClick={handleDelete} id='delete' sx={{ color: 'red' }} >Delete</MenuItem> */}
            </Menu>
        </>
    )
}