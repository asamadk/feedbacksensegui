import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DynamicComponentIcon from './DynamicComponentIcon'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getIconColorById } from '../Utils/FeedbackUtils';
import ComponentSelectorModal from '../FlowModals/ComponentSelectorModal';
import NodeError from '../Components/NodeError';
import { validateFlowComponent } from '../Utils/FeedbackUtils';
import { validateComponentLogic } from '../Utils/FeedbackUtils';

const commonLogoStyle = {
    marginTop: '20px',
    marginRight: '10px'
}

function NodeComponent(props: any) {

    useEffect(() => {
        const componentConfigMap: Map<string, object> = props.config;
        if (componentConfigMap != null) {
            const componentConfig = componentConfigMap.get(props.uniqueId);
            const validatedComp = validateFlowComponent(componentConfig, props.compId);
            const validatedLogic = validateComponentLogic(componentConfig, props.uniqueId, props.compId, props.edges);
            if (validatedComp != null) {
                setShowError(true);
                setErrorMsg(validatedComp);
            } else {
                if (validatedLogic != null) {
                    setShowError(true);
                    setErrorMsg(validatedLogic);
                }
            }
        }
    }, [props.config])


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showSelector, setShowSelector] = useState(false);

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

    const handleShowComponentSelectorModal = () => {
        setShowSelector(true);
    }

    const handleComponentSelection = (selectedCompId: number) => {
        const uId = props.uniqueId;
        setShowSelector(false)
        props.onNodeSelection(selectedCompId, uId);
    }

    return (
        <>
            {
                props.compId !== 14 ?
                    <Box textAlign={'start'} display={'flex'} overflow={'hidden'} onDoubleClick={handleEditButtonClick}>
                        {
                            showError &&
                            <NodeError message={errorMsg} />
                        }
                        <Box sx={commonLogoStyle} >
                            <DynamicComponentIcon id={props.compId} />
                        </Box>
                        <Box >
                            <Typography>{props.label}</Typography>
                            <Typography sx={{ color: '#454545', fontSize: '12px' }} >{props.description?.substring(0, 65) + '...'}</Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={handleOpenMoreClick} sx={{ marginTop: '10px' }} >
                                <MoreVertIcon sx={{ color: getIconColorById(props.compId) }} />
                            </IconButton>
                        </Box>
                    </Box> :
                    <Box justifyContent={'space-between'} display={'flex'} overflow={'hidden'} >
                        <Box sx={{ width: '50px', height: '50px' }} ></Box>
                        <IconButton sx={{ width: '50px', height: '50px', marginTop: '5px' }} onClick={handleShowComponentSelectorModal} >
                            <AddCircleOutlineIcon sx={{ width: '50px', height: '50px' }} />
                        </IconButton>
                        <IconButton onClick={handleOpenMoreClick} sx={{ marginTop: '10px', width: '45px' }} >
                            <MoreVertIcon sx={{ color: getIconColorById(props.compId) }} />
                        </IconButton>
                    </Box>
            }
            <NodeComponentMore
                anchor={anchorEl}
                open={open}
                close={handleCloseMore}
                edit={handleEditButtonClick}
                delete={handleDeleteButtonClick}
                showEditOption={props.compId !== 14}
            />
            {
                showSelector &&
                <ComponentSelectorModal
                    open={showSelector}
                    close={() => setShowSelector(false)}
                    onSelection={handleComponentSelection}
                />
            }
        </>
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
            {
                props.showEditOption &&
                <MenuItem onClick={props.edit}>
                    <EditRoundedIcon />
                    Edit
                </MenuItem>
            }
            <MenuItem onClick={props.delete} >
                <DeleteRoundedIcon />
                Delete
            </MenuItem>
        </Menu>
    )
}