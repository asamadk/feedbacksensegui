import React, { useState } from 'react'
import { Box } from '@mui/material'
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
import { SURVEY_OPEN_SOURCE, colorPalette } from '../Utils/Constants';
import MainHeaderTab from '../HeaderComponents/MainHeaderTab';

function Header(props: any) {

    let navigate = useNavigate();
    let location = useLocation();
    const { state } = useLocation();
    const dispatch = useDispatch<any>();

    const defaultColor = useSelector((state: any) => state.colorReducer);
    const [showSurveyDetailHeader, setShowSurveyDetailHeader] = React.useState<Boolean>(false);
    const [inOrgSelectionMode, setInOrgSelectionMode] = React.useState<Boolean>(false);
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);
    const workflowDirty = useSelector((state: any) => state.workflowDirty);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [backHome, setBackHome] = useState(false);
    const [iconJoyrideOver, setIconJoyrideOver] = useState<any>(false);

    const bodyStyle: {} = {
        backgroundColor: defaultColor,
        padding: '5px 20px',
        borderBottom: `0.5px ${colorPalette.fsGray} solid`,
        paddingBottom: '0px'
    }

    React.useEffect(() => {
        let currentPath: string = location.pathname;
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
            navigate('/surveys');
            setBackHome(true);
        }
    }


    const handleSuccessButtonClick = () => {
        navigate('/surveys');
        setShowGenericModal(false);
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = false;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
        dispatch(updateWorkflowCheck(tempWorkflowDirty));
    }

    return (
        <>
            {
                props.loggedIn && inOrgSelectionMode === false && showSurveyDetailHeader === true &&
                <Box sx={{ ...bodyStyle, background: colorPalette.secondary }} >
                    <div>
                        <SurveyDetailHeader
                            surveyId={currentWorkflowId}
                            tabset={0}
                            handleRouteToHome={handleRouteToHome}
                        />
                    </div>
                    <GenericModal
                        payload={genericModalObj}
                        close={() => setShowGenericModal(false)}
                        open={showGenericModal}
                        callback={handleSuccessButtonClick}
                    />
                </Box>
            }
        </>
    )
}



export default Header