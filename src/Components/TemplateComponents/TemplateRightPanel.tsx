import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import TemplateBlockList from './TemplateBlockList';
import { useSelector } from 'react-redux';
import { colorPalette } from '../../Utils/Constants';

function TemplateRightPanel({
    header, templates
}: { header: string, templates: any[] }) {

    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    }

    return (
        <Box>
            <TemplateRightSubHeader header={header} close={handleClose} />
            <TemplateBlockList templates={templates} />
        </Box>
    )
}

export default TemplateRightPanel

function TemplateRightSubHeader(props: any) {
    return (
        <Box
            display={'flex'}
            padding={'12px'}
        >
            <Typography marginLeft={'10px'} fontSize={'24px'} textAlign={'start'} color={colorPalette.darkBackground} >
                {props.header}
            </Typography>
        </Box>
    )
}