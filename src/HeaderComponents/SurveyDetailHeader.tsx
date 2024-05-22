import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, IconButton } from '@mui/material';
import CustomTabSet from '../Components/CustomTabSet';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { genericModalData } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import { updateWorkflowDirty } from '../Redux/Actions/workflowDirtyActions';
import { useDispatch } from 'react-redux';
import { updateWorkflowCheck } from '../Redux/Actions/workflowCheckActions';
import { colorPalette } from '../Utils/Constants';

const makeIconsUp = {
    position: 'relative',
    top: '-2px',
    width: '50px'
}

const tabsetList = [
    { id: 1, name: 'Automation' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Configure' },
    { id: 4, name: 'Share' },
    { id: 5, name: 'Dashboard' },
]

function SurveyDetailHeader(props: any) {
    let navigate = useNavigate();
    const dispatch = useDispatch<any>();

    const [tabset, setTabset] = React.useState(parseInt(props.tabset))
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);
    const workflowDirty = useSelector((state: any) => state.workflowDirty);
    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();

    const handleRouteToHome = () => {
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
        navigate(-1);
    }

    const changetabset = (value: number) => {
        const isWorkflowDirty = workflowDirty[currentWorkflowId];
        if (isWorkflowDirty === true) {
            setShowGenericModal(true);
            let genDeleteObj: genericModalData = {
                header: 'You have some unsaved changes in workflow',
                warning: 'Warning: There\'s no turning back! I acknowledge that',
                successButtonText: 'Continue without saving',
                cancelButtonText: 'Cancel',
                description: 'The changes will be removed permanently.',
                type: 'next',
                data: {
                    value: value
                }
            }
            setGenericModalObj(genDeleteObj);
            setTabset(tabset);
            return;
        }
        changeTab(value);
    }

    const changeTab = (value: number) => {
        setTabset(value);
        if (value === 0) {
            navigate('/survey/detail/create/' + props.surveyId);
        } else if (value === 1) {
            navigate('/survey/detail/design/' + props.surveyId);
        } else if (value === 2) {
            navigate('/survey/detail/configure/' + props.surveyId);
        } else if (value === 3) {
            navigate('/survey/detail/share/' + props.surveyId);
        } else if (value === 4) {
            navigate('/survey/detail/analyze/' + props.surveyId);
        }
    }

    const handleSuccessButtonClick = () => {
        if (genericModalObj?.type === 'next') {
            const newValue = genericModalObj?.data.value;
            changeTab(newValue);
        } else if (genericModalObj?.type === 'home') {
            navigate(-1);
        }
        setShowGenericModal(false);
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = false;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
        dispatch(updateWorkflowCheck(tempWorkflowDirty));
    }

    return (
        <Box sx={{ display: 'flex',justifyContent : 'space-between' }} >
            <Box width={'50px'} ></Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }} >
                <CustomTabSet tabsetList={tabsetList} change={(value: number) => changetabset(value)} index={props.tabset} />
            </Box>
            <Box sx={{ display: 'flex',justifyContent : 'end' }} >
                <IconButton
                    onClick={props.handleRouteToHome}
                    sx={makeIconsUp}
                >
                    <CloseIcon sx={{ color: colorPalette.darkBackground }} />
                </IconButton>
            </Box>
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </Box>
    )
}

export default SurveyDetailHeader