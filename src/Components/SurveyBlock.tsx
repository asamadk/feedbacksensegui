import { Avatar, Chip, IconButton, Typography } from '@mui/material'
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

const surveyBlockMainContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    backgroundColor: '#181818',
    cursor: 'pointer'
}

function SurveyBlock(props : any) {

    let navigation = useNavigate();
    const snackbarRef: any = useRef(null);

    const [survey , setSurvey] = React.useState<any>(props.survey);
    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [showTitle, setShowTitile] = React.useState(false);
    const [showEditTitle, setShowEditTitle] = React.useState(false);
    const [showSurveyAction, setShowSurveyAction] = React.useState(false);
    const [showGenericModal , setShowGenericModal] = React.useState(false);
    const [showChangeFolderModal , setShowChangeFolderModal] = React.useState(false);
    const [changeFolderSurveyId, setChangeFolderSurveyId] = React.useState('')
    const [deleteSurveyId , setDeleteSurveyId] = React.useState('');
    const [ loading , setLoading] = React.useState(false);

    const handleTextHighlight = (e: any) => {
        e.target.style.color = '#FFA500';
    }

    const handleTextUnhighlight = (e: any) => {
        e.target.style.color = '#454545';
    }

    const handleShowTitle = () => setShowTitile(true);
    const handleHideTitle = () => setShowTitile(false);

    const handleShowEditTitle = () => setShowEditTitle(true);
    const handleHideEditTitle = () => setShowEditTitle(false);

    const handleMoreOptionsClick = () => {
        handleHideEditTitle();
        handleHideTitle();
        setShowSurveyAction(!showSurveyAction);
    }

    const handleDeleteOptionClick = (surveyId : string) => {
        handleMoreOptionsClick();
        setShowGenericModal(true);
        setDeleteSurveyId(surveyId);
        let genDeleteObj : Types.genericModalData = {
            header : 'Do you really want to delete this survey?',
            warning : 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText : 'Delete',
            cancelButtonText : 'Cancel',
            description : 'The entire survey will be removed. | All the responses collected so far will be deleted.',
            type : 'delete'
        }

        setGenericModalObj(genDeleteObj);
    }

    const handleChangeFolderClick = () => {
        handleMoreOptionsClick();
        setShowChangeFolderModal(true);
        setChangeFolderSurveyId(survey.id);
    }

    const handleOpenSurvey = () => {
        let surveyId = survey.id;
        navigation('/survey/detail/create/'+surveyId);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if(genericModalObj?.type === 'delete'){
            handleDeleteSurvey();
        }
    }

    const handleDeleteSurvey = async () => {
        setLoading(true);
        let { data } = await axios.post(deleteSurvey(deleteSurveyId));
        setLoading(false);
        if(data.statusCode !== 200){
            snackbarRef?.current?.show(data?.message, 'error');
            return;
        }
        
        props.delete(deleteSurveyId);
        props.update();
    }

    const handleSuccessChangeFolder = (newSurveyData : any) => {
        props.survey.folder_id = newSurveyData.folder_id;
        props.rerender();
    }

    const handleCloseSingleSurveyAction = () => {
        setShowSurveyAction(false);
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
                    <Popover open={showEditTitle} text={'Edit survey'}/>

                    <IconButton onClick={handleMoreOptionsClick} onMouseEnter={handleShowTitle} onMouseLeave={handleHideTitle} color='warning' sx={{ color: '#f1f1f1' }} >
                        <MoreHorizIcon />
                    </IconButton>
                    <SingleSurveyAction 
                        changeFolder={handleChangeFolderClick} 
                        delete={handleDeleteOptionClick} 
                        open={showSurveyAction}
                        survey={survey}
                        close={handleCloseSingleSurveyAction}
                    />
                    <Popover open={showTitle} text={'Disable,delete and more..'}/>
                </Box>
            </Box>
            <Box onClick={handleOpenSurvey} sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex' }} >
                    <Avatar sx={{ bgcolor: '#D81159', width: 24, height: 24, fontSize: 14 }}>{survey?.user_id}</Avatar>
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
            <ChangeFolderModal callback={handleSuccessChangeFolder} surveyId={changeFolderSurveyId} close={() => setShowChangeFolderModal(false)}  open={showChangeFolderModal} />
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default SurveyBlock