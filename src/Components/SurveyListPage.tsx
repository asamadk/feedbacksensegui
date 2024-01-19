import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
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
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { PERM_ISSUE_TEXT, USER_UNAUTH_TEXT, componentName } from '../Utils/Constants';
import { useSelector } from 'react-redux';
import { genericModalData, userRoleType } from '../Utils/types';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { useDispatch } from 'react-redux';
import { setFolders } from '../Redux/Reducers/folderReducer';
import { setSubscriptionDetailRedux } from '../Redux/Reducers/subscriptionDetailReducer';
import { useNavigate } from 'react-router';
import { setCustomSettings } from '../Redux/Reducers/customSettingsReducer';
import GenericModal from '../Modals/GenericModal';


const surveyPageMainContainer = {
    display: 'flex',
    height: '100%',
    color: '#f1f1f1',
}

const allSurveyFolder = (bgColor: string) => {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        paddingBottom: '10px',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: bgColor
    }
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
    color: '#808080',
    paddingTop: '15px',
    paddingBottom: '15px'
}


function SurveyListPage() {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openInviteModal, setOpenInviteModal] = React.useState(false);
    const [openCreateFolderModal, setOpenCreateFolderModal] = React.useState(false);
    const [selectedFolder, setSelectedFolder] = React.useState<string>('All Surveys');
    const [selectedFolderId, setSelectedFolderId] = React.useState<string>('0');
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const folderState = useSelector((state: any) => state.folders);
    const subscriptionState = useSelector((state: any) => state.subscriptionDetail);
    const surveyState = useSelector((state: any) => state.surveys);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [loading, setLoading] = React.useState(false);

    let init = false;

    useEffect(() => {
        if (init === false) {
            getFolders(false);
            fetchCustomSettings();
            if (CoreUtils.isComponentVisible(userRole, componentName.SUBSCRIPTION)) {
                getSubscriptionDetails();
            }
            init = true;
        }
    }, []);

    useEffect(() => {
        updateActiveSurveyCount();
    }, [surveyState]);

    const fetchCustomSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(Endpoints.getCustomSettingsAPI(), { withCredentials: true });
            setLoading(false);
            const tempSettings = data?.data;
            dispatch(setCustomSettings(tempSettings));
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const updateActiveSurveyCount = () => {
        if (subscriptionState == null || subscriptionState.surveyLimitUsed == null) {
            return;
        }
        const tempSubsState = JSON.parse(JSON.stringify(subscriptionState));
        let count = 0;
        surveyState.forEach((srv: any) => {
            if (srv.is_published === 1) {
                count++;
            }
        });
        tempSubsState.surveyLimitUsed = count;
        dispatch(setSubscriptionDetailRedux(tempSubsState));
    }

    const getSubscriptionDetails = async () => {
        try {
            if (subscriptionState == null) {
                setLoading(true);
                let { data } = await axios.get(Endpoints.getSubscriptionDetailHome(), { withCredentials: true });
                setLoading(false);
                if (data.statusCode !== 200) {
                    snackbarRef?.current?.show(data?.message, 'error');
                    return;
                }

                let resData: any[] = data.data;
                if (resData != null) {
                    dispatch(setSubscriptionDetailRedux(resData));
                }
            }
        } catch (error: any) {
            setLoading(false);
            if (error?.response?.data?.message === PERM_ISSUE_TEXT) {
                return;
            }
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const getFolders = async (fetchFromAPI: boolean) => {
        try {

            if (fetchFromAPI === true || (folderState == null || folderState.length < 1)) {
                setLoading(true);
                let folderRes = await axios.get(Endpoints.getFolders(), { withCredentials: true });
                setLoading(false);
                if (folderRes?.data?.statusCode !== 200) {
                    snackbarRef?.current?.show(folderRes?.data?.message, 'error');
                    return;
                }

                let resData: any = folderRes.data;
                if (resData == null) {
                    return;
                }
                dispatch(setFolders(resData.data));
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
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
            element.style.background = defaultColor?.backgroundColor;
        });

        e.target.style.background = defaultColor?.primaryColor;

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
            element.style.background = defaultColor?.backgroundColor;
        })

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.background = defaultColor?.backgroundColor;
        });
        e.target.style.background = defaultColor?.primaryColor;
    }

    const handleOpenInviteModal = () => setOpenInviteModal(true);
    const handleCloseInviteModal = () => setOpenInviteModal(false);

    const handleOpenCreateFolderModal = () => setOpenCreateFolderModal(true);

    const handleCloseCreateFolderModal = (type: string) => {
        setOpenCreateFolderModal(false)
        if (type === 'save') {
            getFolders(true);
        }
    }

    const highlightCreateFolder = (e: any) => {
        e.target.style.color = '#006dff';
    }

    const unhighlightCreateFolder = (e: any) => {
        // e.target.style.color = defaultColor?.primaryColor;
        e.target.style.color = '#808080';
    }

    const handleShowModalOnDelete = (folderId: string) => {
        setShowGenericModal(true);
        let genDeleteObj: genericModalData = {
            header: 'Do you really want to delete this folder?',
            warning: 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            description: 'The folder will be removed permanently.',
            type: 'delete',
            data : folderId
        }
        setGenericModalObj(genDeleteObj);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'delete') {
            handleDeleteFolderClick();
        }
    }

    const handleDeleteFolderClick = async () => {
        try {
            const folderId: string = genericModalObj?.data;
            setLoading(true);
            const { data } = await axios.delete(Endpoints.deleteFolder(folderId), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data?.message, 'success');
            // setFolderList(fld => fld.filter(folder => folder.id !== folderId));
            dispatch(setFolders(folderState.filter((folder: any) => folder.id !== folderId)));
            setSelectedFolder('All Surveys');
            setSelectedFolderId('0');
            document.querySelectorAll<HTMLElement>('.all-folders-data').forEach(element => {
                element.style.background = defaultColor?.primaryColor;
            });
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const handleUpdateComponent = () => {
        getSubscriptionDetails();
    }

    const handleUpgradePlanClick = () => {
        navigate('/upgrade/plan');
        // window.open('https://www.feedbacksense.io/pricing', '__blank');
    }

    const handleRerenderSurveyCreate = () => {
        setSelectedFolder('All Surveys');
        setSelectedFolderId('0');

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.background = defaultColor?.backgroundColor;
        });

        document.querySelectorAll<HTMLElement>('.all-folders-data').forEach(element => {
            element.style.background = defaultColor?.primaryColor;
        })
    }

    return (
        <>
            <div style={surveyPageMainContainer} >
                <div style={{ display: 'flex', width: '15%', flexDirection: 'column', borderRight: '1px #454545 solid', justifyContent: 'space-between', padding: '10px 30px' }} >
                    <div style={{ width: '100%', overflowY: 'scroll', paddingBottom: '20px' }} >
                        <div style={allSurveyFolder(defaultColor?.primaryColor)} className="all-folders-data" onClick={handleAllFolderClick} >
                            <Typography style={{ pointerEvents: 'none' }} variant='subtitle2' >All Surveys</Typography>
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
                            folderState?.map((folder: any) => {
                                return (
                                    <Tooltip key={folder.id} title={folder.name} >
                                        <div key={folder.id} className="folders-data" style={surveyFolderText} onClick={(e) => handleFolderClick(e, folder.name, folder.id)} >
                                            <Typography
                                                title={folder.name}
                                                style={{ pointerEvents: 'none' }}
                                                variant='subtitle2'
                                            >{folder.name?.substring(0, 15)}{folder?.name?.length > 15 ? '...' : ''}</Typography>
                                            <IconButton
                                                onClick={() => handleShowModalOnDelete(folder.id)}
                                                style={{ padding: '0px' }}
                                                size='small' >
                                                <DeleteIcon sx={{ color: '#f1f1f1', fontSize: '15px' }} />
                                            </IconButton>
                                        </div>
                                    </Tooltip>
                                )
                            })
                        }

                    </div>
                    {
                        CoreUtils.isComponentVisible(userRole, componentName.BILLING_INFO_HOME) &&
                        <div style={{ borderTop: '1px #454545 solid' }} >
                            <div style={{ color: '#808080', paddingTop: '10px' }}>
                                <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Subscription</Typography>
                            </div>
                            <Typography style={{ textAlign: 'start' }} variant='subtitle2' >{subscriptionState?.name}</Typography>

                            <div style={{ color: '#808080', paddingTop: '10px' }}>
                                <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Billing cycle</Typography>
                            </div>
                            <Typography style={{ textAlign: 'start', paddingBottom: '30px' }} variant='subtitle2' >{subscriptionState?.billingCycle}</Typography>

                            <Typography style={{ textAlign: 'start' }} variant='subtitle2' >Active survey limit</Typography>
                            <LinearProgressWithLabel
                                value={subscriptionState == null ? 0 : subscriptionState?.surveyLimitUsed / subscriptionState?.totalSurveyLimit * 100}
                                text={subscriptionState == null ? '0' : subscriptionState?.surveyLimitUsed + '/' + subscriptionState?.totalSurveyLimit}
                            />
                            <div style={{ marginTop: '40px' }} ></div>
                            <Button sx={ButtonStyles.containedButton} onClick={handleUpgradePlanClick} variant="contained">Upgrade plan</Button>
                            <Button sx={ButtonStyles.outlinedButton} onClick={handleOpenInviteModal} variant="outlined">Invite teammates</Button>
                        </div>
                    }
                </div>
                <div style={{ width: '85%' }} >
                    <SurveysPanel
                        folder={selectedFolder}
                        folderId={selectedFolderId}
                        update={handleUpdateComponent}
                        runOnSurveyCreate={handleRerenderSurveyCreate}
                    />
                </div>
                <InviteMemberModal open={openInviteModal} close={handleCloseInviteModal} />
                <CreateFolder open={openCreateFolderModal} close={handleCloseCreateFolderModal} />
            </div>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </>
    )
}

export default SurveyListPage
