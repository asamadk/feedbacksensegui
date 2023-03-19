import { Button, Container, Typography } from '@mui/material'

import React from 'react'
import SurveyListPage from '../Components/SurveyListPage';

const containedButtonStyle = {
    marginTop: '10px',
    backgroundColor: '#D81159',
    "&.MuiButtonBase-root:hover": {
        bgcolor: "#FF367F"
    }
}

function MainBody() {

    const [isEmpty, setIsEmpty] = React.useState<Boolean>(false);

    return (
        <div style={{
            backgroundColor: '#1E1E1E',
            height : 'calc(100vh - 78px)'
        }} >
            {isEmpty && <ShowEmptyBody />}
            {!isEmpty && <SurveyListPage />}
        </div>
    )
}

function ShowEmptyBody() {
    return (
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }} >
            <img style={{ maxWidth: 230 }} alt='Create your first survey to get started!' src='/completed-task.png'></img>
            <Typography style={{ color: '#f1f1f1' }} variant='h6'>Create your first survey to get started!</Typography>
            <Typography style={{ color: '#FFA500' }} variant='subtitle2'>Click the button below to add your first survey.</Typography>
            <Button sx={containedButtonStyle} variant="contained">Get Started</Button>
        </div>
    )
}

export default MainBody