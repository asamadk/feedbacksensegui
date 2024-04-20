import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../../Utils/Constants';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const iconStyle = { fontWeight: 500, marginRight: '10px', color: colorPalette.fsGray };

function PersonDetailTab({ person }: any) {
    const [details, setDetails] = useState<any[]>([]);

    useEffect(() => {
        const tmp = [];
        tmp.push({
            icon: <BadgeIcon sx={iconStyle} />,
            label: 'Name',
            value: `${person?.firstName} ${person?.lastName}`
        });
        tmp.push({
            icon: <EmailIcon sx={iconStyle} />,
            label: 'Email',
            value: person?.email
        });
        tmp.push({
            icon: <LocalPhoneIcon sx={iconStyle} />,
            label: 'Phone',
            value: person?.phone || 'N/A'
        });
        tmp.push({
            icon: <ApartmentIcon sx={iconStyle} />,
            label: 'Company',
            value: person?.company?.name
        });
        tmp.push({
            icon: <ContactPhoneIcon sx={iconStyle} />,
            label: 'Communication Preference',
            value: person?.communicationPreferences || 'N/A'
        });
        tmp.push({
            icon: <CalendarMonthIcon sx={iconStyle} />,
            label: 'Last Contacted Date',
            value: person?.lastContactedDate != null ? new Date(person.lastContactedDate).toDateString() : 'N/A'
        });
        tmp.push({
            icon: <CalendarMonthIcon sx={iconStyle} />,
            label: 'Engagement Score',
            value: person?.engagementScore || 'N/A'
        });
        tmp.push({
            icon: <CalendarMonthIcon sx={iconStyle} />,
            label: 'Total Support Tickets',
            value: person?.supportTicketCount || 'N/A'
        });
        tmp.push({
            icon: <CalendarMonthIcon sx={iconStyle} />,
            label: 'Joined On',
            value: new Date(person?.created_at).toDateString()
        });
        
        setDetails(tmp);
    }, []);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', height: 'calc(100vh - 121px)', overflowY: 'scroll' }} >
            <Box sx={{ width: '40%', padding: '20px' }} >
                {
                    details?.map(d => (
                        <Grid container sx={{ textAlign: 'start', margin: '5px' }} spacing={1.5}>
                            <Grid sx={{ display: 'flex' }} item xs>
                                {d.icon}
                                <Typography fontWeight={600} sx={{ color: colorPalette.fsGray }} >{d.label}</Typography>
                            </Grid>
                            <Grid item xs>
                                <Typography>{d.value}</Typography>
                            </Grid>
                        </Grid>
                    ))
                }
            </Box>
        </Box>
    )
}

export default PersonDetailTab