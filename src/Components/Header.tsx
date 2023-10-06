import React from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate } from 'react-router';
import MainHeaderIcons from '../HeaderComponents/MainHeaderIcons';
import SurveyDetailHeader from '../HeaderComponents/SurveyDetailHeader';
import Logo from './Logo';
import GenericModal from '../Modals/GenericModal';
import { useSelector } from 'react-redux';
import { genericModalData } from '../Utils/types';
import { useDispatch } from 'react-redux';
import { updateWorkflowDirty } from '../Redux/Actions/workflowDirtyActions';
import { updateWorkflowCheck } from '../Redux/Actions/workflowCheckActions';

const bodyStyle: {} = {
    backgroundColor: '#1E1E1E',
    padding: '10px 20px',
    borderBottom: '1px #454545 solid'
}

function Header(props: any) {

    let navigate = useNavigate();
    let location = useLocation();
    const dispatch = useDispatch<any>();

    const [showSurveyDetailHeader, setShowSurveyDetailHeader] = React.useState<Boolean>(false);
    const [inOrgSelectionMode, setInOrgSelectionMode] = React.useState<Boolean>(false);
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);
    const workflowDirty = useSelector((state: any) => state.workflowDirty);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();

    React.useEffect(() => {
        let currentPath: string = location.pathname;
        console.log("🚀 ~ file: Header.tsx:35 ~ React.useEffect ~ currentPath:", currentPath)
        if (currentPath.includes('/user/create/organization')) {
            setInOrgSelectionMode(true);
        } else {
            setInOrgSelectionMode(false);
            if (currentPath.includes('/survey/detail/')) {
                setShowSurveyDetailHeader(true);
            } else {
                setShowSurveyDetailHeader(false);
            }
        }
    }, [location.pathname]);



    const handleRouteToHome = () => {
        if (inOrgSelectionMode === false) {
            const isWorkflowDirty = workflowDirty[currentWorkflowId];
            if (isWorkflowDirty === true) {
                setShowGenericModal(true);
                let genDeleteObj: genericModalData = {
                    header: 'You have some unsaved changes in workflow',
                    warning: 'Warning: There\'s no turning back! I acknowledge that',
                    successButtonText: 'Continue without saving',
                    cancelButtonText: 'Cancel',
                    description: 'The changes will be removed permanently.',
                    type: 'home',
                }
                setGenericModalObj(genDeleteObj);
                return;
            }
            navigate('/');
        }
    }

    const handleSuccessButtonClick = () => {
        navigate('/');
        setShowGenericModal(false);
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = false;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
        dispatch(updateWorkflowCheck(tempWorkflowDirty));
    }

    return (
        <div style={bodyStyle} >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {inOrgSelectionMode === false && showSurveyDetailHeader === false &&
                    <Box sx={{ marginLeft: '10px' }} onClick={handleRouteToHome} >
                        <Logo />
                    </Box>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === false && <div><MainHeaderIcons /></div>}

                {inOrgSelectionMode === false && showSurveyDetailHeader === true &&
                    <Box sx={{ marginTop: '8px' }} onClick={handleRouteToHome} >
                        <Logo />
                    </Box>
                }
                {props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === true && <div><SurveyDetailHeader surveyId={props.surveyId} tabset={0} /></div>}

            </div>
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </div>
    )
}



export default Header