import { Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CreateFolder from '../Modals/CreateFolder';
import SurveysPanel from './SurveysPanel';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { USER_LOCAL_KEY } from '../Utils/Constants';
import CustomAlert from './CustomAlert';


const surveyPageMainContainer = {
    display: 'flex',
    height: '100%',
    color: '#f1f1f1'
}

const allSurveyFolder = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    paddingBottom: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#454545'
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

    const [folderList, setFolderList] = React.useState<any[]>([]);
    const [openInviteModal, setOpeninviteModal] = React.useState(false);
    const [openCreateFolderModal, setopenCreateFolderModal] = React.useState(false);
    const [subscriptionDetails, setSubscriptionDetail] = React.useState<any>();
    const [selectedFolder, setSelectedFolder] = React.useState<string>('All Surveys');
    const [selectedFolderId, setSelectedFolderId] = React.useState<string>('0');
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertType, setAlertType] = React.useState('');

    useEffect(() => {
        getFolders();
        getSubscriptionDetails();
    }, []);

    const getSubscriptionDetails = async () => {
        let res = await axios.get(Endpoints.getSubscriptionDetail());
        const isValidated = FeedbackUtils.validateAPIResponse(res);
        if (isValidated === false) {
            return;
        }

        let resData: any[] = res.data;
        if (resData != null) {
            setSubscriptionDetail(resData);
        }
    }

    const getFolders = async () => {
        let orgId = FeedbackUtils.getOrgId();
        if (orgId == null) {
            setOpenAlert(true);
            setAlertType('error');
            setAlertMessage('Something went wrong, please contact the admin');
        }

        let folderRes = await axios.get(Endpoints.getFolders(orgId));
        const isValidated = FeedbackUtils.validateAPIResponse(folderRes);
        if (isValidated === false) {
            //something went wrong
            return;
        }

        let resData: any = folderRes.data;
        if (resData == null) {
            return;
        }

        if (resData.statusCode !== 200) {
            //TODO show error
            return;
        }

        setFolderList(resData.data);
    }

    const handleAllFolderClick = (e: any) => {
        let className: string = e.target.className;

        if (className?.toLowerCase() !== 'all-folders-data') {
            return;
        }

        setSelectedFolder('All Surveys');
        setSelectedFolderId('0');

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.background = '#1E1E1E';
        });

        e.target.style.background = '#323533';

    }

    const handleFolderClick = (e: any, folderName: string, folderId: string) => {
        let className: string = e.target.className;

        if (className == null || typeof className !== 'string') {
            return;
        }

        if (className.toLowerCase() !== 'folders-data') {
            return;
        }

        setSelectedFolder(folderName);
        setSelectedFolderId(folderId);

        document.querySelectorAll<HTMLElement>('.all-folders-data').forEach(element => {
            element.style.background = '#1E1E1E';
        })

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.background = '#1E1E1E';
        });
        e.target.style.background = '#323533';
    }

    const handleOpenInviteModal = () => setOpeninviteModal(true);
    const handleCloseInviteModal = () => setOpeninviteModal(false);

    const handleOpenCreateFolderModal = () => setopenCreateFolderModal(true);
    const handleCloseCreateFolderModal = (type: string) => {
        setopenCreateFolderModal(false)
        if (type === 'save') {
            getFolders();
        }
    }

    const highlightCreateFolder = (e: any) => {
        e.target.style.color = '#FFA500';
    }

    const unhighlightCreateFolder = (e: any) => {
        e.target.style.color = '#323533';
    }

    const handleDeleteFolderClick = (folderId: string) => {
        console.log('handleDeleteFolderClick', folderId);
    }


    return (
        <>
            <div style={surveyPageMainContainer} >
                <CustomAlert open={openAlert} message={alertMessage} type={alertType} />
                <div style={{ display: 'flex', width: '15%', flexDirection: 'column', borderRight: '1px #454545 solid', justifyContent: 'space-between', padding: '10px 30px' }} >
                    <div style={{ width: '100%', overflowY: 'scroll' }} >
                        <div style={allSurveyFolder} className="all-folders-data" onClick={handleAllFolderClick} >
                            <Typography variant='subtitle2' >All Surveys</Typography>
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
                            folderList?.map(folder => {
                                return (
                                    <div key={folder.id} className="folders-data" style={surveyFolderText} onClick={(e) => handleFolderClick(e, folder.name, folder.id)} >
                                        <Typography variant='subtitle2' >{folder.name}</Typography>
                                        <IconButton
                                            onClick={() => handleDeleteFolderClick(folder.id)}
                                            style={{ padding: '0px' }}
                                            size='small' >
                                            <DeleteIcon sx={{color : '#f1f1f1', fontSize : '15px'}} />
                                        </IconButton>
                                    </div>
                                )
                            })
                        }

                    </div>
                    <div style={{ borderTop: '1px #454545 solid' }} >
                        <div style={{ color: '#323533', paddingTop: '10px' }}>
                            <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Subscription</Typography>
                        </div>
                        <Typography style={{ textAlign: 'start', paddingBottom: '30px' }} variant='subtitle2' >{subscriptionDetails?.subscriptionType}</Typography>
                        <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Active survey limit</Typography>
                        <LinearProgressWithLabel
                            value={subscriptionDetails?.totalActiveSurvey / subscriptionDetails?.activeSurveyLimit * 100}
                            text={subscriptionDetails?.totalActiveSurvey + '/' + subscriptionDetails?.activeSurveyLimit}
                        />
                        <div style={{ marginTop: '40px' }} ></div>
                        <Button sx={ButtonStyles.containedButton} variant="contained">Upgrade plan</Button>
                        <Button sx={ButtonStyles.outlinedButton} onClick={handleOpenInviteModal} variant="outlined">Invite teammates</Button>

                    </div>
                </div>
                <div style={{ width: '85%' }} >
                    <SurveysPanel
                        folder={selectedFolder}
                        folderId={selectedFolderId}
                    />
                </div>
                <InviteMemberModal open={openInviteModal} close={handleCloseInviteModal} />
                <CreateFolder open={openCreateFolderModal} close={handleCloseCreateFolderModal} />
            </div>
        </>
    )
}

export default SurveyListPage
