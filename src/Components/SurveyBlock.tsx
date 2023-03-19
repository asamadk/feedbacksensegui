import { Avatar, Chip, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import * as Types from '../Utils/types' 
import React, { useState } from 'react'
import Popover from './Popover';
import SingleSurveyAction from './SingleSurveyAction';
import GenericModal from '../Modals/GenericModal';
import ChangeFolderModal from '../Modals/ChangeFolderModal';
import CustomChip from './CustomChip';
import { useNavigate } from 'react-router';

const surveyBlockMainContainer = {
    border: '1px #454545 solid',
    borderRadius: '5px',
    backgroundColor: '#181818',
    cursor: 'pointer'
}

function SurveyBlock() {

    let navigation = useNavigate();

    const [genericModalObj, setGenericModalObj] = React.useState<Types.genericModalData>();
    const [showTitle, setShowTitile] = React.useState(false);
    const [showEditTitle, setShowEditTitle] = React.useState(false);
    const [showSurveyAction, setShowSurveyAction] = React.useState(false);
    const [showGenericModal , setShowGenericModal] = React.useState(false);
    const [showChangeFolderModal , setShowChangeFolderModal] = React.useState(false);

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

    const handleDeleteOptionClick = () => {
        handleMoreOptionsClick();
        setShowGenericModal(true);

        let genDeleteObj : Types.genericModalData = {
            header : 'Do you really want to delete this survey?',
            warning : 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText : 'Delete',
            cancelButtonText : 'Cancel',
            description : 'The entire survey will be removed. | All the responses collected so far will be deleted.'
        }

        setGenericModalObj(genDeleteObj);
    }

    const handleChangeFolderClick = () => {
        handleMoreOptionsClick();
        setShowChangeFolderModal(true);
    }

    const handleOpenSurvey = () => {
        let surveyId = 122;
        navigation('/survey/detail/create/'+surveyId);
    }

    return (
        <Box sx={surveyBlockMainContainer} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '0.5px #454545 solid' }} >
                <Typography sx={{ paddingTop: '10px' }} >Survey one</Typography>
                <Box>
                    <IconButton onClick={handleOpenSurvey} onMouseEnter={handleShowEditTitle} onMouseLeave={handleHideEditTitle} color='warning' sx={{ color: '#f1f1f1' }} >
                        <EditIcon />
                    </IconButton>
                    <Popover open={showEditTitle} text={'Edit survey'}/>

                    <IconButton onClick={handleMoreOptionsClick} onMouseEnter={handleShowTitle} onMouseLeave={handleHideTitle} color='warning' sx={{ color: '#f1f1f1' }} >
                        <MoreHorizIcon />
                    </IconButton>
                    <SingleSurveyAction changeFolder={handleChangeFolderClick} delete={handleDeleteOptionClick} open={showSurveyAction}/>
                    <Popover open={showTitle} text={'Disable,delete and more..'}/>
                </Box>
            </Box>
            <Box sx={{ padding: '15px', paddingBottom: '10px' }} >
                <Box sx={{ display: 'flex' }} >
                    <Avatar sx={{ bgcolor: '#D81159', width: 24, height: 24, fontSize: 14 }}>N</Avatar>
                    <Typography variant='subtitle1' sx={{ fontSize: 14, marginLeft: '5px', color: '#454545' }} >Created 2 days ago</Typography>
                </Box>
                <Box sx={{ display: 'flex', marginTop: '50px', justifyContent: 'space-between' }} >
                    <CustomChip />
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
            <GenericModal payload={genericModalObj} close={() => setShowGenericModal(false)} open={showGenericModal} />
            <ChangeFolderModal close={() => setShowChangeFolderModal(false)}  open={showChangeFolderModal} />
        </Box>
    )
}

export default SurveyBlock