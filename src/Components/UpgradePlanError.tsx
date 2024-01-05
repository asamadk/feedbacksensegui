import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { containedButton } from '../Styles/ButtonStyle';
import { useNavigate } from 'react-router';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function UpgradePlanError({ message,desc,showButton }: { message: string,desc : string,showButton : boolean }) {

    const navigate = useNavigate();

    const handleUpgrade = () => {
        navigate('/upgrade/plan')
    }

    return (
        <Box>
            <AutoAwesomeIcon 
                sx={{ color: '#006dff',fontSize : 50 }} 
            />
            <Typography 
                color={'white'} 
                variant='h5'
                fontWeight={500}
            >
                    {message}
            </Typography>
            <Typography
                color={'#808080'}
            >
                {desc}
            </Typography>
            {
                showButton === true &&
                <Button
                    onClick={handleUpgrade}
                    sx={{...containedButton,width : 'fit-content'}} >
                    Upgrade
                </Button>
            }
        </Box>
    )
}

export default UpgradePlanError