import { Box, Button, IconButton, SxProps, TextField, Theme, Tooltip, Typography, styled } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import InviteMemberModal from '../Modals/InviteMemberModal';
import AppsIcon from '@mui/icons-material/Apps';
import Groups2Icon from '@mui/icons-material/Groups2';
import * as ButtonStyles from '../Styles/ButtonStyle'
import CreateFolder from '../Modals/CreateFolder';
import SurveysPanel from './SurveysPanel';
import SearchIcon from '@mui/icons-material/Search';
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PERM_ISSUE_TEXT, USER_UNAUTH_TEXT, colorPalette, componentName, joyrideConstants } from '../Utils/Constants';
import { useSelector } from 'react-redux';
import { genericModalData, joyrideState, userRoleType } from '../Utils/types';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import { useDispatch } from 'react-redux';
import { setFolders } from '../Redux/Reducers/folderReducer';
import { setSubscriptionDetailRedux } from '../Redux/Reducers/subscriptionDetailReducer';
import { useNavigate } from 'react-router';
import { setCustomSettings } from '../Redux/Reducers/customSettingsReducer';
import GenericModal from '../Modals/GenericModal';
import { textFieldStyle } from '../Styles/InputStyles';
import ReactJoyride, { ACTIONS, CallBackProps, STATUS } from 'react-joyride';
import { FOLDER_FEATURE_ACTIVE } from '../Utils/CustomSettingsConst';
import UpgradePlanError from './UpgradePlanError';


const surveyPageMainContainer = {
    display: 'flex',
    height: '100%',
    color: '#f1f1f1',
}

const leftSectionStyle: any = {
    height: '100vh',
    background: colorPalette.secondary,
    display: 'flex',
    width: '18%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '10px 0px rgba(0, 0, 0, 0.08)'
}

const allSurveyFolder = (bgColor: string) => {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        paddingBottom: '10px',
        cursor: 'pointer',
        backgroundColor: bgColor,
        color: colorPalette.textPrimary,
        fontWeight : 600
    }
}

const surveyFolderText = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    paddingBottom: '10px',
    cursor: 'pointer',
    color: colorPalette.fsGray,
    fontWeight : 600
}

const folderText = {
    display: 'flex',
    justifyContent: 'space-between',
    color: colorPalette.textPrimary,
    padding: '15px'
}

function SurveyListPage() {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openInviteModal, setOpenInviteModal] = React.useState(false);
    const [openCreateFolderModal, setOpenCreateFolderModal] = React.useState(false);
    const [folderManualClose, setFolderManualClose] = React.useState(false);
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
    const [hoveredRow, setHoveredRow] = useState<string | null>(null);
    const [showFolder, setShowFolder] = useState(false);

    const [{ run, steps, stepIndex }, setState] = useState<joyrideState>({
        run: false,
        stepIndex: 0,
        steps: [
            {
                content:
                    <>
                        <h2>Welcome to Feedback Sense,</h2>
                        <p>Take a quick look around FeedbackSense with our short tutorial </p>
                    </>,
                locale: { skip: <strong aria-label="skip">SKIP</strong> },
                placement: 'center',
                target: 'body',
            },
            {
                content:
                    <>
                        <h2>Invite teammates</h2>
                        <p>You can invite your teammates directly from here</p>
                    </>,
                target: '.invite-teammates',
                disableBeacon: true,
                disableOverlayClose: true,
                placement: 'top',
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
            {
                content:
                    <>
                        <h2>Create workspace</h2>
                        <p>
                            You can create, organize, and collaborate over your surveys here.
                            Let's create your first workspace. Click on “+” to create your workspace</p>
                    </>,
                target: '.create-workspace',
                disableBeacon: true,
                disableOverlayClose: true,
                // hideCloseButton: true,
                // hideFooter: true,
                placement: 'bottom',
                spotlightClicks: true,
                styles: {
                    options: {
                        zIndex: 10000,
                    },
                },
            },
        ],
    });

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

    const handlePlanVisibility = (tempSettings: any) => {
        //TODO uncomment this section (commenting this just for testing) and remove the first setState
        setShowFolder(true);
        // if (tempSettings != null && tempSettings[FOLDER_FEATURE_ACTIVE] === 'true') {
        //     setShowFolder(true);
        // } else {
        //     setShowFolder(false);
        // }
    }

    const fetchCustomSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(Endpoints.getCustomSettingsAPI(), { withCredentials: true });
            setLoading(false);
            const tempSettings = data?.data;
            dispatch(setCustomSettings(tempSettings));
            handlePlanVisibility(tempSettings);
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
            element.style.color = colorPalette.fsGray;
        });

        e.target.style.fontWeight = '600';
        e.target.style.color = colorPalette.darkBackground;
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
            element.style.color = colorPalette.fsGray;
        })

        document.querySelectorAll<HTMLElement>('.folders-data').forEach(element => {
            element.style.color = colorPalette.fsGray;
        });

        e.target.style.fontWeight = '600';
        e.target.style.color = colorPalette.darkBackground;

    }

    const handleCloseInviteModal = () => setOpenInviteModal(false);

    const handleOpenCreateFolderModal = () => {
        setOpenCreateFolderModal(true);
        setState({
            run: false,
            steps: steps,
            stepIndex: 3,
        });
    }

    const handleCloseCreateFolderModal = (type: string) => {
        setOpenCreateFolderModal(false);
        setFolderManualClose(true);
        if (type === 'save') {
            getFolders(true);
        }
    }

    const highlightCreateFolder = (e: any) => {
        e.target.style.color = colorPalette.primary;
    }

    const unhighlightCreateFolder = (e: any) => {
        e.target.style.color = colorPalette.textPrimary;
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
            data: folderId
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

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setState({ run: false, steps: steps, stepIndex: 0, });
        }
    };

    useEffect(() => {
        handleJoyrideVisibility();
    }, []);

    const handleJoyrideVisibility = () => {
        const hasSeenJoyride = localStorage.getItem(joyrideConstants.JOYRIDE_1);
        if (!hasSeenJoyride) {
            setState({
                run: true,
                steps: steps,
                stepIndex: 0,
            });
            setTimeout(() => {
                localStorage.setItem(joyrideConstants.JOYRIDE_1, 'true');
            }, 1000);
        }
    }

    return (
        <>
            <ReactJoyride
                callback={handleJoyrideCallback}
                continuous
                hideCloseButton
                run={run}
                scrollToFirstStep
                // showProgress
                showSkipButton
                steps={steps}
                styles={{
                    options: {
                        zIndex: 10000,
                    },
                    buttonNext: {
                        backgroundColor: colorPalette.primary
                    },
                    buttonBack: {
                        color: colorPalette.primary
                    }
                }}
            />

            <div style={surveyPageMainContainer} >
                <div style={leftSectionStyle} >
                    <div style={{ width: '100%', overflowY: 'scroll', paddingBottom: '20px' }} >
                        <div style={folderText}>
                            <Box sx={{ display: 'flex' }} >
                                <ArrowDropDownIcon />
                                <Typography variant='subtitle2' fontWeight={'600'} >My Workspace</Typography>
                            </Box>
                            <Typography
                                className='create-workspace'
                                onMouseEnter={highlightCreateFolder}
                                onMouseLeave={unhighlightCreateFolder}
                                onClick={handleOpenCreateFolderModal}
                                style={{ cursor: 'pointer' }}
                                fontSize={'18px'}
                            >
                                +
                            </Typography>
                        </div>
                        <div style={allSurveyFolder(colorPalette.secondary)} className="all-folders-data" onClick={handleAllFolderClick} >
                            <Typography style={{ pointerEvents: 'none' }} variant='subtitle2' >All Surveys</Typography>
                        </div>
                        {
                            showFolder ?
                                folderState?.map((folder: any) => {
                                    return (
                                        <div
                                            key={folder.id}
                                            className="folders-data"
                                            style={surveyFolderText}
                                            onClick={(e) => handleFolderClick(e, folder.name, folder.id)}
                                            onMouseEnter={() => setHoveredRow(folder.id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                        >
                                            <Typography
                                                title={folder.name}
                                                style={{ pointerEvents: 'none', fontWeight: hoveredRow === folder.id ? 600 : 500 }}
                                                variant='subtitle2'
                                            >{folder.name?.substring(0, 15)}{folder?.name?.length > 15 ? '...' : ''}</Typography>
                                            {
                                                hoveredRow === folder.id &&
                                                <IconButton
                                                    onClick={() => handleShowModalOnDelete(folder.id)}
                                                    style={{ padding: '0px' }}
                                                    size='small' >
                                                    <DeleteIcon sx={{ color: colorPalette.textPrimary, fontSize: '15px' }} />
                                                </IconButton>
                                            }
                                        </div>
                                    )
                                }) :
                                <Box marginTop={'20px'} >
                                    <UpgradePlanError
                                        message='Upgrade for Workspaces'
                                        desc='Unlock the power of organization.Upgrade now to organize your surveys.'
                                        showButton={true}
                                    />
                                </Box>
                        }

                    </div>
                </div>
                <div style={{ width: '85%' }} >
                    <SurveysPanel
                        folder={selectedFolder}
                        folderId={selectedFolderId}
                        update={handleUpdateComponent}
                        folderModalClose={folderManualClose}
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
