import { Box, IconButton, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import TemplateBlockList from './TemplateBlockList';
import { useSelector } from 'react-redux';

function TemplateRightPanel({
    header, templates
}: { header: string, templates: any[] }) {

    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    }

    const defaultColor = useSelector((state: any) => state.colorReducer);


    return (
        <Box sx={{ backgroundColor: defaultColor?.backgroundColor }}  >
            <TemplateRightSubHeader header={header} close={handleClose} />
            <TemplateBlockList templates={templates} />
        </Box>
    )
}

export default TemplateRightPanel

function TemplateRightSubHeader(props: any) {
    const defaultColor = useSelector((state: any) => state.colorReducer);
    return (
        <Box
            sx={{ backgroundColor: defaultColor?.backgroundColor }}
            display={'flex'}
            padding={'12px'}
        >
            <IconButton onClick={props.close} sx={{ color: '#f1f1f1',backgroundColor :defaultColor?.primaryColor }} >
                {/* <CloseIcon /> */}
                <ArrowBackIcon/>
            </IconButton>
            <Typography marginLeft={'10px'} fontSize={'24px'} textAlign={'start'} color={'white'} >
                {props.header}
            </Typography>
        </Box>
    )
}