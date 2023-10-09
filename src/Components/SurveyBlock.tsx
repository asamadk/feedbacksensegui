import { Avatar, Button, Chip, IconButton, Popover, Typography } from '@mui/material'
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
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import CustomPopover from './Popover';
import { useDispatch } from 'react-redux';
import { updateCurrentWorkflow } from '../Redux/Actions/currentWorkflowActions';
import { useSelector } from 'react-redux';

const surveyBlockMainContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    cursor: 'pointer',
    height: '200px',
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
    const openName = Boolean(nameAnchorEl);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTextHighlight = (e: any) => {
        e.target.style.color = '#006DFF';
    }

    const handleTextUnhighlight = (e: any) => {
        e.target.style.color = '#454545';
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
        props.survey.folder_id = newSurveyData.folder_id;
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

    return (
        <Box sx={{...surveyBlockMainContainer,backgroundColor : defaultColor?.secondaryColor}} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '0.5px #454545 solid', height: '50px' }} >
                <Box>

                    <Typography
                        aria-owns={openName ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => setNameAnchorEl(e.currentTarget)}
                        onMouseLeave={() => setNameAnchorEl(null)}
                        sx={{ paddingTop: '10px' }}
                    >
                        {survey?.name?.substring(0, 25)}
                        {survey?.name?.length > 30 ? '...' : ''}
                    </Typography>
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={openName}
                        anchorEl={nameAnchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={() => setNameAnchorEl(null)}
                        disableRestoreFocus
                    >        <Typography sx={{ p: 1 }}>{survey?.name}</Typography>
                    </Popover>
                </Box>
                <Box display={'flex'} >
                    <IconButton
                        onClick={handleOpenSurvey}
                        onMouseEnter={handleShowEditTitle}
                        onMouseLeave={handleHideEditTitle}
                        sx={{ color: '#f1f1f1', width: '50px' }}
                    >
                        <EditIcon />
                    </IconButton>
                    <Box>
                        <CustomPopover open={showEditTitle} text={'Edit survey'} />
                    </Box>
                    <IconButton id="basic-button"
                        onClick={handleClick}
                        sx={{ color: '#f1f1f1', width: '50px' }}
                    >
                        <MoreHorizIcon />
                    </IconButton>
                    <SingleSurveyAction
                        anchor={anchorEl}
                        changeFolder={handleChangeFolderClick}
                        delete={handleDeleteOptionClick}
                        open={open}
                        survey={survey}
                        closeAndUpdate={handleCloseAndUpdate}
                        updateSurveyList={updateSurveyList}
                        close={handleCloseSingleSurveyAction}
                    />
                </Box>
            </Box>
            <Box onClick={handleOpenSurvey} sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex' }} >
                    <Avatar sx={{ bgcolor: '#006DFF', width: 24, height: 24, fontSize: 14 }} alt={survey?.username} src={survey?.image} />
                    <Typography variant='subtitle1' sx={{ fontSize: 14, marginLeft: '5px', color: '#454545' }} >
                        {new Date(survey?.created_at).toDateString()}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', marginTop: '50px', justifyContent: 'space-between' }} >
                    <CustomChip status={survey?.is_published === 1 ? 'success' : 'failed'} />
                    <Box sx={{ display: 'flex' }} >
                        <EqualizerIcon />
                        <Typography
                            sx={{ fontSize: 14, textDecoration: 'underline', cursor: 'pointer', color: '#454545' }}
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
            />
            {
                showChangeFolderModal &&
                <ChangeFolderModal callback={handleSuccessChangeFolder} surveyId={changeFolderSurveyId} close={() => setShowChangeFolderModal(false)} open={showChangeFolderModal} />
            }
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default SurveyBlock