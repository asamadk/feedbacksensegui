import { Box, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material'
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
import { colorPalette } from '../Utils/Constants';

const commonLogoStyle = {
    marginRight: '10px'
}

function NodeComponent(props: any) {

    const [description , setDescription] = useState('');

    useEffect(() => {
        const componentConfigMap: Map<string, object> = props.config;
        if (componentConfigMap != null) {
            const componentConfig :any | undefined = componentConfigMap.get(props.uniqueId);
            if(componentConfig != null && componentConfig?.desc && componentConfig?.desc?.length > 0){
                setDescription(componentConfig?.desc)
            }else{
                setDescription(props.description);
            }
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

    function SurveyNode() {
        return <>
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
                            <Typography
                                sx={{ color: colorPalette.textPrimary, fontSize: '12px', marginTop: '15px' }}
                            >
                                {props.description?.substring(0, 120)}
                                {props.description?.length > 120 ? '...' : ''}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={handleOpenMoreClick} sx={{ marginTop: '30px' }} >
                                <MoreVertIcon sx={{ color: getIconColorById(props.compId) }} />
                            </IconButton>
                        </Box>
                    </Box> :
                    <Box justifyContent={'space-between'} display={'flex'} overflow={'hidden'} >
                        <Box sx={{ width: '50px', height: '50px' }} ></Box>
                        <IconButton sx={{ width: '50px', height: '50px', marginTop: '25px' }} onClick={handleShowComponentSelectorModal} >
                            <AddCircleOutlineIcon sx={{ width: '50px', height: '50px' }} />
                        </IconButton>
                        <IconButton onClick={handleOpenMoreClick} sx={{ marginTop: '25px', width: '45px', height: '45px' }} >
                            <MoreVertIcon sx={{ color: getIconColorById(props.compId) }} />
                        </IconButton>
                    </Box>
            }
        </>
    }

    function AutomationNode() {

        const actionButtonStyle = {
            borderRadius: '50%',
            border: `1px ${colorPalette.primary} solid`,
            padding: '2px',
            color: colorPalette.primary
        }

        return <>
            <Box onDoubleClick={handleEditButtonClick}>
                {showError && <NodeError message={errorMsg} />}
                <Box sx={{ display: 'flex',justifyContent: 'space-between' }} >
                    <Box display={'flex'} >
                        <DynamicComponentIcon id={props.compId} />
                        <Typography marginLeft={'5px'} >{props.label}</Typography>
                    </Box>
                    <Box>
                        <IconButton size='small' onClick={handleEditButtonClick} >
                            <EditRoundedIcon
                                sx={{ ...actionButtonStyle, fontSize: '14px' }}
                            />
                        </IconButton>
                        <IconButton size='small' onClick={handleDeleteButtonClick} >
                            <DeleteRoundedIcon sx={{ ...actionButtonStyle, fontSize: '14px' }} fontSize='small' />
                        </IconButton>
                    </Box>
                </Box>
                {/* <Divider sx={{background : colorPalette.secondary}} /> */}
                <Typography sx={{ fontSize: '12px', textAlign: 'start' }} > 
                    {description.length > 85 ? description.substring(0,85) + '...' : description}
                </Typography>
            </Box>
        </>
    }

    function DynamicNode() {
        return props.source === 'flow' ? AutomationNode() : SurveyNode();
    }

    return (
        <>
            {DynamicNode()}
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