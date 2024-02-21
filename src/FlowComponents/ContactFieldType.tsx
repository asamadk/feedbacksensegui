import { MenuItem, Select } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { muiSelectStyle } from '../Styles/InputStyles';
import { contactFieldTypes } from '../Utils/Constants';

function ContactFieldType(props: any) {

    const fields = [
        {
            value: contactFieldTypes.FIRST_NAME,
            label: 'First Name'
        },
        {
            value: contactFieldTypes.LAST_NAME,
            label: 'Last Name'
        },
        {
            value: contactFieldTypes.ORG,
            label: 'Organization'
        },
        {
            value: contactFieldTypes.EMAIL,
            label: 'E Mail'
        },
        {
            value: contactFieldTypes.JOB_TITLE,
            label: 'Job Title'
        },
        {
            value: contactFieldTypes.DEPARTMENT,
            label: 'Department'
        },
        {
            value: contactFieldTypes.PHONE,
            label: 'Phone'
        },
        {
            value: contactFieldTypes.WEBSITE,
            label: 'Website'
        },
        {
            value: contactFieldTypes.COUNTRY,
            label: 'Country'
        },
        {
            value: contactFieldTypes.ADDRESS_1,
            label: 'Address 1'
        },
        {
            value: contactFieldTypes.ADDRESS_2,
            label: 'Address 2'
        },
        {
            value: contactFieldTypes.CITY,
            label: 'City'
        },
        {
            value: contactFieldTypes.STATE,
            label: 'State'
        },
        {
            value: contactFieldTypes.ZIP,
            label: 'Zip'
        },
        {
            value: contactFieldTypes.ANNUAL_REVENUE,
            label: 'Annual Revenue'
        },
        {
            value: contactFieldTypes.EMP,
            label: 'Employees'
        },
        {
            value: contactFieldTypes.COMMENT,
            label: 'Comment'
        },
    ]

    const [selectedField, setSelectedField] = useState(props?.value || 'comment');

    useEffect(() => {
        setSelectedField(props?.value || 'comment');
    }, [props?.value]);

    const handleFieldChange = (event: any) => {
        const val = event?.target?.value;
        setSelectedField(val);
        props.updateField(val, props.index);
    }

    return (
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedField}
            size='small'
            sx={{ ...muiSelectStyle, width: '150px', height: '40px' }}
            onChange={handleFieldChange}
            fullWidth
        >
            {fields.map(f => { return (<MenuItem value={f.value}>{f.label}</MenuItem>) })}
        </Select>
    )
}

export default ContactFieldType