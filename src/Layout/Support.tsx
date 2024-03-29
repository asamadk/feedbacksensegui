import { Box, IconButton, Typography } from '@mui/material';
import React from 'react'
import { useSelector } from 'react-redux';
import { settingLayoutStyle, settingsHeaderTextStyle } from '../Styles/LayoutStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { colorPalette } from '../Utils/Constants';

function Support() {

    let navigation = useNavigate();

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const handleBackButtonClick = () => {
        navigation('/');
    }

    return (
        <Box sx={{ ...settingLayoutStyle, backgroundColor: defaultColor?.backgroundColor }} >
            <Box >
                <iframe
                    style={{ width: '50%', height: '500px' }}
                    id="zsfeedbackFrame"
                    name="zsfeedbackFrame"
                    scrolling="no"
                    frameBorder="0"
                    src="https://desk.zoho.in/support/fbw?formType=AdvancedWebForm&fbwId=edbsnadf5522686456005960ffd139855cadd44a38b441b8462c74d77c2eb2218cb96&xnQsjsdp=edbsn55e6cbe8ec624f5f71cbc0a2246b0f62&mode=showNewWidget&displayType=iframe"
                ></iframe>
            </Box>
        </Box>
    )
}

export default Support