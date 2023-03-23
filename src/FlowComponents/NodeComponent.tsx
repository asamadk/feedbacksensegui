import { Box, Typography } from '@mui/material'
import React from 'react'
import DynamicComponentIcon from './DynamicComponentIcon'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Popover from '../Components/Popover';

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

    const [showDeleteText , setShowDeleteText] = React.useState(false);
    const [showEditText , setShowEditText] = React.useState(false);

    const handleDeleteButtonClick = (e : any) => {
        props.delete(props.uniqueId);
    }

    const handleEditButtonClick = () => {
        props.edit(props.uniqueId,props.compId);
    }

  return (
    <Box textAlign={'start'} display={'flex'} overflow={'hidden'} >
        <Box onMouseEnter={() => setShowDeleteText(true)} onMouseLeave={() => setShowDeleteText(false)} onClick={handleDeleteButtonClick} sx={deleteButton} >
            <DeleteRoundedIcon/>
            <Popover open={showDeleteText} text={'Delete'}/>
        </Box>
        <Box onMouseEnter={() => setShowEditText(true)} onMouseLeave={() => setShowEditText(false)}  onClick={handleEditButtonClick} sx={editButton} >
            <EditRoundedIcon/>
            <Popover open={showEditText} text={'Edit'}/>
        </Box>
        <Box sx={commonLogoStyle} >
            <DynamicComponentIcon id={props.compId} />
        </Box>
        <Box>
            <Typography>{props.label}</Typography>
            <Typography sx={{color : '#454545', fontSize : '12px'}} >{props.description?.substring(0,83)+'...'}</Typography>
        </Box>
    </Box>
  )
}

export default NodeComponent