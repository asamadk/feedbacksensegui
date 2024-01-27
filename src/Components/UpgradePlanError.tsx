import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { useNavigate } from 'react-router';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { colorPalette } from '../Utils/Constants';

function UpgradePlanError({ message,desc,showButton }: { message: string,desc : string,showButton : boolean }) {

    const navigate = useNavigate();

    const handleUpgrade = () => {
        navigate('/upgrade/plan')
    }

    return (
        <Box>
            <AutoAwesomeIcon 
                sx={{ color: colorPalette.primary,fontSize : 50 }} 
            />
            <Typography 
                color={colorPalette.darkBackground} 
                variant='h5'
                fontWeight={500}
            >
                    {message}
            </Typography>
            <Typography
                color={colorPalette.fsGray}
            >
                {desc}
            </Typography>
            {
                showButton === true ?
                <Button
                    onClick={handleUpgrade}
                    sx={{...containedButton,width : 'fit-content'}} >
                    Upgrade
                </Button> : 
                <Box sx={{marginTop : '20px'}} ></Box>
            }
        </Box>
    )
}

export default UpgradePlanError