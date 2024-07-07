import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../../Utils/Constants';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { getPersonName } from '../../Utils/FeedbackUtils';
import TitleIcon from '@mui/icons-material/Title';
import ContactsIcon from '@mui/icons-material/Contacts';
import EditPersonAttributeModal from './EditPersonAttributeModal';
import { personFieldType } from '../../Utils/types';
import { useNavigate } from 'react-router';

const iconStyle = { fontWeight: 500, marginRight: '10px', color: colorPalette.fsGray };

function PersonDetailTab({ person }: any) {

    const [details, setDetails] = useState<any[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [fieldType, setFieldType] = useState<personFieldType>('firstName');
    const [selectedFieldData, setSelectedFieldData] = useState<any>('')

    const navigate = useNavigate();

    useEffect(() => {
        populateAttributes();
    }, [person]);

    function handlePersonUpdate(data: any) {
        setShowEdit(false);
        if (data == null) { return; }
        for (const key in data) {
            person[key] = data[key];
        }
        populateAttributes();
    }

    function populateAttributes() {
        const tmp = [];
        tmp.push({
            icon: <BadgeIcon sx={iconStyle} />,
            label: 'First Name',
            value: person.firstName,
            edit: true,
            type: 'firstName'
        });
        tmp.push({
            icon: <BadgeIcon sx={iconStyle} />,
            label: 'Last Name',
            value: person.lastName,
            edit: true,
            type: 'lastName'
        });
        tmp.push({
            icon: <EmailIcon sx={iconStyle} />,
            label: 'Email',
            value: person?.email,
            edit: true,
            type: 'email'
        });
        tmp.push({
            icon: <LocalPhoneIcon sx={iconStyle} />,
            label: 'Phone',
            value: person?.phone || 'None',
            edit: true,
            type: 'phone'
        });
        tmp.push({
            icon: <TitleIcon sx={iconStyle} />,
            label: 'Title',
            value: person?.title || 'None',
            edit: true,
            type: 'title'
        });
        tmp.push({
            icon: <ApartmentIcon sx={iconStyle} />,
            label: 'Company',
            value: person?.company?.name,
            edit: false,
            // edit: true,
            type : 'company'
        });
        tmp.push({
            icon: <ContactPhoneIcon sx={iconStyle} />,
            label: 'Communication Preference',
            value: person?.communicationPreferences || 'None',
            edit: true,
            type: 'communicationPreferences'
        });
        tmp.push({
            icon: <ContactsIcon sx={iconStyle} />,
            label: 'Last Contacted Date',
            value: person?.lastContactedDate != null ? new Date(person.lastContactedDate).toDateString() : 'None',
            edit: true,
            type: 'lastContactedDate'
        });
        tmp.push({
            icon: <CalendarMonthIcon sx={iconStyle} />,
            label: 'Joined On',
            value: new Date(person?.created_at).toDateString()
        });

        setDetails(tmp);
    }

    function handleEditAttribute(edit: boolean, label: string, val: any, type: personFieldType) {
        if (edit === false) { return; }
        // if(type === 'company'){
        //     navigate(`/contacts/companies/detail/${person?.company?.id}`, { state: {id : person?.company?.id} });
        // }
        setShowEdit(true);
        setFieldType(type);
        setSelectedFieldData(val);
    }

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
                                {/* <Typography>{d.value}</Typography> */}
                                <Typography
                                    fontWeight={d.edit === true ? 600 : 500}
                                    sx={{ color: colorPalette.textPrimary, cursor: d.edit === true ? 'pointer' : 'default' }}
                                    onClick={() => handleEditAttribute(d.edit, d.label, d.value, d.type)}
                                >{d.value}</Typography>
                            </Grid>
                        </Grid>
                    ))
                }
            </Box>
            {
                showEdit &&
                <EditPersonAttributeModal
                    open={showEdit}
                    close={() => setShowEdit(false)}
                    personId={person.id}
                    type={fieldType}
                    value={selectedFieldData}
                    update={handlePersonUpdate}
                />
            }
        </Box>
    )
}

export default PersonDetailTab