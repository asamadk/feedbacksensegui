import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';
import { colorPalette } from '../Utils/Constants';

function InfoComponent({ message,color }: { message: string,color : string }) {
    return (
        <Tooltip title={message} >
            <InfoIcon sx={{fontSize : '15px',color : color}} />
        </Tooltip>
    )
}

export default InfoComponent