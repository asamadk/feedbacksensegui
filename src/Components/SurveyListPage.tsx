import { Button, Typography } from '@mui/material';
import React from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CreateFolder from '../Modals/CreateFolder';
import SurveysPanel from './SurveysPanel';


const surveyPageMainContainer = {
    display: 'flex',
    height: '100%',
    color: '#f1f1f1'
}

const surveyFolderText = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    paddingBottom: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
}

const folderText = {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#323533',
    paddingTop: '15px',
    paddingBottom: '15px'
}

const allFolderData = [
    {
        name: 'Evening Survey',
        count: 3
    },
    {
        name: 'Morning Survey',
        count: 2
    }
]


function SurveyListPage() {

    const [openInviteModal, setOpeninviteModal] = React.useState(false);
    const [openCreateFolderModal, setopenCreateFolderModal] = React.useState(false);


    const handleFolderClick = (e: any) => {

        let className :string= e.target.className;
        if(className.toLowerCase() !== 'folders-data'){
            return;
        }

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.background = '#1E1E1E';
        });
        e.target.style.background = '#323533';
    }

    const handleOpenInviteModal = () => setOpeninviteModal(true);
    const handleCloseInviteModal = () => setOpeninviteModal(false);

    const handleOpenCreateFolderModal = () => setopenCreateFolderModal(true);
    const handleCloseCreateFolderModal = () => setopenCreateFolderModal(false);

    const highlightCreateFolder = (e : any) => {
        e.target.style.color = '#FFA500';
    }

    const unhighlightCreateFolder = (e : any) => {
        e.target.style.color = '#323533';
    }


    return (
        <div style={surveyPageMainContainer} >
            <div style={{ display: 'flex', width: '15%', flexDirection: 'column', borderRight: '1px #454545 solid', justifyContent: 'space-between', padding: '10px 30px' }} >
                <div style={{ width: '100%', overflowY : 'scroll' }} >
                    <div style={surveyFolderText} className="folders-data" onClick={handleFolderClick} >
                        <Typography variant='subtitle2' >All Surveys</Typography>
                        <Typography variant='subtitle2' >5</Typography>
                    </div>
                    <div style={folderText}>
                        <Typography variant='subtitle2' >FOLDERS</Typography>
                        <Typography 
                            onMouseEnter={highlightCreateFolder}
                            onMouseLeave={unhighlightCreateFolder}
                            onClick={handleOpenCreateFolderModal} 
                            style={{ textDecoration: 'underline', cursor: 'pointer' }} 
                            variant='subtitle2' >
                                create new
                            </Typography>
                    </div>

                    {
                        allFolderData.map(folder => {
                            return (
                                <div key={folder.name} className="folders-data" style={surveyFolderText} onClick={handleFolderClick} >
                                    <Typography variant='subtitle2' >{folder.name}</Typography>
                                    <Typography variant='subtitle2' >{folder.count}</Typography>
                                </div>
                            )
                        })
                    }

                </div>
                <div style={{ borderTop: '1px #454545 solid' }} >
                    <div style={{color: '#323533',paddingTop : '10px'}}>
                        <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Subscription</Typography>
                    </div>
                    <Typography style={{ textAlign: 'start', paddingBottom : '30px' }} variant='subtitle2' >Free</Typography>
                    <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Active survey limit</Typography>
                    <LinearProgressWithLabel value={10} text={'0/1'}/>
                    <div style={{marginTop : '40px'}} ></div>
                    <Button sx={ButtonStyles.containedButton} variant="contained">Upgrade plan</Button>
                    <Button sx={ButtonStyles.outlinedButton} onClick={handleOpenInviteModal} variant="outlined">Invite teammates</Button>

                </div>
            </div>
            <div style={{ width: '85%' }} >
                <SurveysPanel/>
            </div>
            <InviteMemberModal open={openInviteModal}  close={handleCloseInviteModal} />
            <CreateFolder open={openCreateFolderModal} close={handleCloseCreateFolderModal} />
        </div>
    )
}

export default SurveyListPage
