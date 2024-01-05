import React, { useEffect } from 'react'
import SurveyListPage from '../Components/SurveyListPage';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

function MainBody() {

    const defaultColor = useSelector((state: any) => state.colorReducer);

    return (
        <Box style={{
            backgroundColor: defaultColor?.backgroundColor,
            height : 'calc(100vh - 58px)'
        }} >
            <SurveyListPage />
        </Box>
    )
}

export default MainBody