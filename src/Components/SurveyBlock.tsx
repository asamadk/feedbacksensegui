import { Avatar, Button, Chip, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import * as Types from '../Utils/types'
import React, { useEffect, useRef, useState } from 'react'
import SingleSurveyAction from './SingleSurveyAction';
import GenericModal from '../Modals/GenericModal';
import ChangeFolderModal from '../Modals/ChangeFolderModal';
import CustomChip from './CustomChip';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { deleteSurvey } from '../Utils/Endpoints';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import CustomPopover from './Popover';
import { useDispatch } from 'react-redux';
import { updateCurrentWorkflow } from '../Redux/Actions/currentWorkflowActions';
import { useSelector } from 'react-redux';
import { setSubscriptionDetailRedux } from '../Redux/Reducers/subscriptionDetailReducer';

const surveyBlockMainContainer = {
    borderRadius: '5px',
    cursor: 'pointer',
    height: '197px',
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
    border : `1px ${colorPalette.textSecondary} solid`,
    background : colorPalette.textSecondary
}

function SurveyBlock(props: any) {

    useEffect(() => {
        setSurvey(props.survey);
    }, [props.survey])

    let navigation = useNavigate();
    const snackbarRef: any = useRef(null);
    const dispatch = useDispatch<any>();
    const [survey, setSurvey] = React.useState<any>(props.survey);
    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [showEditTitle, setShowEditTitle] = React.useState(false);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [showChangeFolderModal, setShowChangeFolderModal] = React.useState(false);
    const [changeFolderSurveyId, setChangeFolderSurveyId] = React.useState('')
    const [deleteSurveyId, setDeleteSurveyId] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [nameAnchorEl, setNameAnchorEl] = React.useState<HTMLElement | null>(null);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const subscriptionState = useSelector((state: any) => state.subscriptionDetail);

    const openName = Boolean(nameAnchorEl);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTextHighlight = (e: any) => {
        e.target.style.color = colorPalette.primary;
    }

    const handleTextUnhighlight = (e: any) => {
        e.target.style.color = colorPalette.fsGray;
    }

    const handleShowEditTitle = () => setShowEditTitle(true);
    const handleHideEditTitle = () => setShowEditTitle(false);

    const handleMoreOptionsClick = () => {
        handleHideEditTitle();
    }

    const handleDeleteOptionClick = (surveyId: string) => {
        handleMoreOptionsClick();
        setAnchorEl(null);
        setShowGenericModal(true);
        setDeleteSurveyId(surveyId);
        let genDeleteObj: Types.genericModalData = {
            header: 'Do you really want to delete this survey?',
            warning: 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            description: 'The entire survey will be removed. | All the responses collected so far will be deleted.',
            type: 'delete'
        }

        setGenericModalObj(genDeleteObj);
    }

    const handleChangeFolderClick = () => {
        setAnchorEl(null);
        handleMoreOptionsClick();
        setShowChangeFolderModal(true);
        setChangeFolderSurveyId(survey.id);
    }

    const handleOpenSurvey = () => {
        let surveyId = survey.id;
        dispatch(updateCurrentWorkflow(surveyId));
        navigation('/survey/detail/create/' + surveyId);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'delete') {
            handleDeleteSurvey();
        }
    }

    const handleDeleteSurvey = async () => {
        try {
            setLoading(true);
            let { data } = await axios.post(deleteSurvey(deleteSurveyId), {}, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            updateActiveSurveyCount('reduce');
            props.delete(deleteSurveyId);
            props.update();
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleSuccessChangeFolder = (newSurveyData: any) => {
        // props.survey.folder_id = newSurveyData.folder_id;
        const updatedSurvey = { ...props.survey, folder_id: newSurveyData.folder_id };
        props.updateSurvey(updatedSurvey.id, updatedSurvey);
        props.rerender();
    }

    const handleCloseSingleSurveyAction = () => {
        setAnchorEl(null);
    }

    const handleCloseAndUpdate = () => {
        setAnchorEl(null);
        props.update();
    }

    const updateSurveyList = () => {
        setAnchorEl(null);
        props.updateSurveyList();
    }

    const updateSurveyPublishStatus = (status: 0 | 1) => {
        setSurvey((prevData: any) => ({
            ...prevData,
            is_published: status
        }));
    };

    const updateActiveSurveyCount = (type: 'add' | 'reduce') => {
        const tempSubsState = JSON.parse(JSON.stringify(subscriptionState));
        if(tempSubsState == null){return;}
        let count = tempSubsState?.surveyLimitUsed || 0;

        if (type === 'add') {
            count++;
        } else {
            count = Math.max(count - 1, 0);
        }

        tempSubsState.surveyLimitUsed = count;
        dispatch(setSubscriptionDetailRedux(tempSubsState));
    }

    return (
        <Box sx={surveyBlockMainContainer} >
            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', height: '50px' }}
            >
                <Box>
                    <Tooltip title={survey?.name} >
                        <Typography
                            aria-owns={openName ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            sx={{ paddingTop: '10px', color: colorPalette.textPrimary }}
                        >
                            {survey?.name?.substring(0, 25)}
                            {survey?.name?.length > 30 ? '...' : ''}
                        </Typography>
                    </Tooltip>
                </Box>
                <Box display={'flex'} >
                    <Tooltip title={'Edit'} >
                        <IconButton
                            onClick={handleOpenSurvey}
                            sx={{ color: colorPalette.textPrimary, width: '50px' }}
                        >
                            <EditIcon fontSize='small' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='More' >
                        <IconButton id="basic-button"
                            onClick={handleClick}
                            sx={{ color: colorPalette.textPrimary, width: '50px' }}
                        >
                            <MoreHorizIcon />
                        </IconButton>
                    </Tooltip>
                    <SingleSurveyAction
                        anchor={anchorEl}
                        changeFolder={handleChangeFolderClick}
                        delete={handleDeleteOptionClick}
                        open={open}
                        survey={survey}
                        closeAndUpdate={handleCloseAndUpdate}
                        updateSurveyList={updateSurveyList}
                        close={handleCloseSingleSurveyAction}
                        updatePublishStatus={updateSurveyPublishStatus}
                        updateActiveSurveyCount={updateActiveSurveyCount}
                    />
                </Box>
            </Box>
            <Box onClick={handleOpenSurvey} sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex',marginTop: '40px',marginBottom : '10px' }} >
                    <Avatar sx={{ bgcolor: colorPalette.primary, width: 24, height: 24, fontSize: 14 }} alt={survey?.username} src={survey?.image} />
                    <Typography variant='subtitle1' sx={{ fontSize: 14, marginLeft: '5px', color: colorPalette.textPrimary }} >
                        {new Date(survey?.created_at).toDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                    <CustomChip status={survey?.is_published === 1 ? 'success' : 'failed'} />
                    <Box sx={{ display: 'flex' }} >
                        <EqualizerIcon sx={{color : colorPalette.fsGray}} />
                        <Typography
                            sx={{ fontSize: 14,marginTop : '2px', textDecoration: 'underline', cursor: 'pointer', color: colorPalette.fsGray }}
                            onMouseEnter={handleTextHighlight}
                            onMouseLeave={handleTextUnhighlight}
                        >
                            Response
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
                dualConfirmation={true}
            />
            {
                showChangeFolderModal &&
                <ChangeFolderModal
                    callback={handleSuccessChangeFolder}
                    surveyId={changeFolderSurveyId}
                    close={() => setShowChangeFolderModal(false)}
                    open={showChangeFolderModal}
                />
            }
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default SurveyBlock