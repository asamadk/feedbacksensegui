import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import DynamicComponentIcon from './DynamicComponentIcon'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { getIconColorById } from '../Utils/FeedbackUtils';

const commonLogoStyle = {
    marginTop: '20px',
    marginRight: '10px'
}

function NodeComponent(props: any) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleDeleteButtonClick = (e: any) => {
        handleCloseMore();
        props.delete(props.uniqueId);
    }

    const handleEditButtonClick = () => {
        handleCloseMore();
        props.edit(props.uniqueId, props.compId);
    }

    const handleCloseMore = () => {
        setAnchorEl(null);
    }

    const handleOpenMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Box textAlign={'start'} display={'flex'} overflow={'hidden'} onDoubleClick={handleEditButtonClick}>
            <Box sx={commonLogoStyle} >
                <DynamicComponentIcon id={props.compId} />
            </Box>
            <Box >
                <Typography>{props.label}</Typography>
                <Typography sx={{ color: '#454545', fontSize: '12px' }} >{props.description?.substring(0, 65) + '...'}</Typography>
            </Box>
            <Box>
                <IconButton onClick={handleOpenMoreClick} sx={{ marginTop: '10px' }} >
                    <MoreVertIcon sx={{color : getIconColorById(props.compId)}} />
                </IconButton>
            </Box>
            <NodeComponentMore
                anchor={anchorEl}
                open={open}
                close={handleCloseMore}
                edit={handleEditButtonClick}
                delete={handleDeleteButtonClick}
            />
        </Box>
    )
}

export default NodeComponent

function NodeComponentMore(props: any) {
    return (
        <Menu
            id="basic-menu"
            anchorEl={props.anchor}
            open={props.open}
            onClose={props.close}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem onClick={props.edit}>
                <EditRoundedIcon />
                Edit
            </MenuItem>
            <MenuItem onClick={props.delete} >
                <DeleteRoundedIcon />
                Delete
            </MenuItem>
        </Menu>
    )
}