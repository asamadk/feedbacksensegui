import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import TemplateBlockList from './TemplateBlockList';

function TemplateRightPanel({
    header, templates
}: { header: string, templates: any[] }) {

    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    }

    return (
        <Box sx={{ backgroundColor: '#181818', overflowY: 'scroll' }} height={'calc(100vh - 62px)'} >
            <TemplateRightSubHeader header={header} close={handleClose} />
            <TemplateBlockList templates={templates} />
        </Box>
    )
}

export default TemplateRightPanel

function TemplateRightSubHeader(props: any) {
    return (
        <Box
            sx={{ backgroundColor: '#1E1E1E' }}
            display={'flex'}
            justifyContent={'space-between'}
            padding={'12px'}
            borderBottom={'1px #454545 solid'}
        >
            <Typography fontSize={'24px'} textAlign={'start'} color={'white'} >
                {props.header}
            </Typography>
            <IconButton onClick={props.close} sx={{ color: '#f1f1f1' }} >
                <CloseIcon />
            </IconButton>
        </Box>
    )
}