import { Box, Typography } from '@mui/material'
import React from 'react'
import DynamicComponentIcon from './DynamicComponentIcon'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const commonLogoStyle = {
    marginTop: '20px',
    marginRight: '10px'
}

const editButton = {
    position: 'absolute',
    top: '-30px',
    right: '40px',
    cursor : 'pointer'
}

const deleteButton = {
    position: 'absolute',
    top: '-30px',
    right: '10px',
    cursor : 'pointer'
}

function NodeComponent(props : any) {

    const handleDeleteButtonClick = () => {
        console.log('handleDeleteButtonClick');
    }

    const handleEditButtonClick = () => {
        console.log('handleEdiButtonClick')
    }

  return (
    <Box textAlign={'start'} display={'flex'}>
        <Box  onClick={handleDeleteButtonClick} sx={deleteButton} >
            <DeleteRoundedIcon/>
        </Box>
        <Box  onClick={handleEditButtonClick} sx={editButton} >
            <EditRoundedIcon/>
        </Box>
        <Box sx={commonLogoStyle} >
            <DynamicComponentIcon id={props.compId} />
        </Box>
        <Box>
            <Typography>{props.label}</Typography>
            <Typography sx={{color : '#454545', fontSize : '12px'}} >{props.description}</Typography>
        </Box>
    </Box>
  )
}

export default NodeComponent