import { Avatar, Button, Chip, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import * as Types from '../Utils/types'
import React, { useRef, useState } from 'react'
import Popover from './Popover';
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

const surveyBlockMainContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    backgroundColor: '#181818',
    cursor: 'pointer'
}

function SurveyBlock(props: any) {

    let navigation = useNavigate();
    const snackbarRef: any = useRef(null);

    const [survey, setSurvey] = React.useState<any>(props.survey);
    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [showEditTitle, setShowEditTitle] = React.useState(false);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [showChangeFolderModal, setShowChangeFolderModal] = React.useState(false);
    const [changeFolderSurveyId, setChangeFolderSurveyId] = React.useState('')
    const [deleteSurveyId, setDeleteSurveyId] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
            let { data } = await axios.post(deleteSurvey(deleteSurveyId),{},{ withCredentials: true });
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
            if(error?.response?.data?.message === USER_UNAUTH_TEXT){
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

    return (
        <Box sx={surveyBlockMainContainer} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '0.5px #454545 solid' }} >
                <Typography sx={{ paddingTop: '10px' }} >{survey?.name}</Typography>
                <Box>
                    <IconButton onClick={handleOpenSurvey} onMouseEnter={handleShowEditTitle} onMouseLeave={handleHideEditTitle} color='warning' sx={{ color: '#f1f1f1' }} >
                        <EditIcon />
                    </IconButton>
                    <Popover open={showEditTitle} text={'Edit survey'} />
                    <IconButton id="basic-button"
                        onClick={handleClick}
                        color='warning'
                        sx={{ color: '#f1f1f1' }}
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
                        close={handleCloseSingleSurveyAction}
                    />
                </Box>
            </Box>
            <Box onClick={handleOpenSurvey} sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex' }} >
                    <Avatar sx={{ bgcolor: '#006DFF', width: 24, height: 24, fontSize: 14 }} alt={survey?.username[0]} src={survey?.image} />
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