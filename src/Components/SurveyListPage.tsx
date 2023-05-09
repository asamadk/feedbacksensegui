import { Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CreateFolder from '../Modals/CreateFolder';
import SurveysPanel from './SurveysPanel';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAlert from './CustomAlert';
import { useNavigate } from 'react-router';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';


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


function SurveyListPage() {

    let navigate = useNavigate();
    const snackbarRef: any = useRef(null);

    const [folderList, setFolderList] = React.useState<any[]>([]);
    const [openInviteModal, setOpeninviteModal] = React.useState(false);
    const [openCreateFolderModal, setopenCreateFolderModal] = React.useState(false);
    const [subscriptionDetails, setSubscriptionDetail] = React.useState<any>();
    const [selectedFolder, setSelectedFolder] = React.useState<string>('All Surveys');
    const [selectedFolderId, setSelectedFolderId] = React.useState<string>('0');
    const [ loading , setLoading] = React.useState(false);

    useEffect(() => {
        getFolders();
        getSubscriptionDetails();
    }, []);

    const getSubscriptionDetails = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getSubscriptionDetailHome(),{ withCredentials : true });
            setLoading(false);
            if(data.statusCode !== 200){
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            
            let resData: any[] = data.data;
            if (resData != null) {
                setSubscriptionDetail(resData);
            }            
        } catch (error : any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            console.warn("🚀 ~ file: IndividualResponse.tsx:81 ~ fetchSurveyResponseList ~ error:", error)
        }
    }

    const getFolders = async () => {
        try {
            let orgId = FeedbackUtils.getOrgId();
            if (orgId == null) {
                snackbarRef?.current?.show('Something went wrong, please contact the admin', 'error');
            }
    
            setLoading(true);
            let folderRes = await axios.get(Endpoints.getFolders(),{ withCredentials : true });
            setLoading(false);
            if(folderRes?.data?.statusCode !== 200){
                snackbarRef?.current?.show(folderRes?.data?.message, 'error');
                return;
            }
    
            let resData: any = folderRes.data;
            if (resData == null) {
                return;
            }
            setFolderList(resData.data);
        } catch (error : any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            console.warn("🚀 ~ file: IndividualResponse.tsx:81 ~ fetchSurveyResponseList ~ error:", error)
        }
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

    const handleDeleteFolderClick = async (folderId: string) => {
        try {
            setLoading(true);
            const { data } = await axios.delete(Endpoints.deleteFolder(folderId),{ withCredentials : true });
            setLoading(false);
            if(data.statusCode !== 200){
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data?.message, 'success');
            setFolderList(fld => fld.filter(folder => folder.id !== folderId));
            setSelectedFolder('All Surveys');
            setSelectedFolderId('0');
        } catch (error : any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            console.warn("🚀 ~ file: IndividualResponse.tsx:81 ~ fetchSurveyResponseList ~ error:", error)
        }
    }

    const handleUpdateComponent = () => {
        getSubscriptionDetails();
    }

    const handleUpgradePlanClick = () => {
        navigate('/upgrade/plan');
    }

    return (
        <>
            <div style={surveyPageMainContainer} >
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
                        <div style={{ color: '#808080', paddingTop: '10px' }}>
                            <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Subscription</Typography>
                        </div>
                        <Typography style={{ textAlign: 'start' }} variant='subtitle2' >{subscriptionDetails?.name}</Typography>

                        <div style={{ color: '#808080', paddingTop: '10px' }}>
                            <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Billing cycle</Typography>
                        </div>
                        <Typography style={{ textAlign: 'start', paddingBottom: '30px' }} variant='subtitle2' >{subscriptionDetails?.billingCycle}</Typography>

                        <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Active survey limit</Typography>
                        <LinearProgressWithLabel
                            value={subscriptionDetails?.surveyLimitUsed / subscriptionDetails?.totalSurveyLimit * 100}
                            text={subscriptionDetails?.surveyLimitUsed + '/' + subscriptionDetails?.totalSurveyLimit}
                        />
                        <div style={{ marginTop: '40px' }} ></div>
                        <Button sx={ButtonStyles.containedButton} onClick={handleUpgradePlanClick} variant="contained">Upgrade plan</Button>
                        <Button sx={ButtonStyles.outlinedButton} onClick={handleOpenInviteModal} variant="outlined">Invite teammates</Button>
                    </div>
                </div>
                <div style={{ width: '85%' }} >
                    <SurveysPanel
                        folder={selectedFolder}
                        folderId={selectedFolderId}
                        update={handleUpdateComponent}
                    />
                </div>
                <InviteMemberModal open={openInviteModal} close={handleCloseInviteModal} />
                <CreateFolder open={openCreateFolderModal} close={handleCloseCreateFolderModal} />
            </div>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </>
    )
}

export default SurveyListPage
