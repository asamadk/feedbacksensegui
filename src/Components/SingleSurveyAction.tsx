import { Menu, MenuItem } from '@mui/material'
import axios from 'axios'
import React, { useRef } from 'react'
import { disableSurvey, duplicateSurveyAPI, enableSurvey, getShareSurveyLink } from '../Utils/Endpoints'
import Notification from '../Utils/Notification'
import CustomAlert from './CustomAlert'
import FSLoader from './FSLoader'
import { USER_UNAUTH_TEXT, componentName } from '../Utils/Constants'
import { useNavigate } from 'react-router'
import { handleLogout } from '../Utils/FeedbackUtils'
import { useSelector } from 'react-redux'
import { userRoleType } from '../Utils/types'
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils'

function SingleSurveyAction(props: any) {

    const [loading, setLoading] = React.useState(false);
    const snackbarRef: any = useRef(null);
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const navigate = useNavigate();

    const handleDisableEnableSurvey = async (e: any) => {
        if (!CoreUtils.isComponentVisible(userRole, componentName.DISABLE_SURVEY)) {
            snackbarRef?.current?.show('Guests cannot publish/unpublish surveys', 'error');
            props.close();
            return;
        }
        let surveyData = props?.survey;
        if (surveyData == null) {
            <CustomAlert open={true} message={'Something went wrong'} type={'error'} />
        }

        if (props?.survey?.is_published === 1) {
            try {
                setLoading(true);
                let { data } = await axios.post(disableSurvey(props?.survey?.id), {}, { withCredentials: true });
                setLoading(false);
                if (data.statusCode !== 200) {
                    snackbarRef?.current?.show(data?.message, 'error');
                    return;
                }
                snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
                surveyData.is_published = 0;
            } catch (error: any) {
                setLoading(false);
                snackbarRef?.current?.show(error?.response?.data?.message, 'error');
                if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                    handleLogout();
                }
            }
        } else {
            try {
                setLoading(true);
                let { data } = await axios.post(enableSurvey(props?.survey?.id), {}, { withCredentials: true });
                setLoading(false);
                if (data.statusCode !== 200) {
                    snackbarRef?.current?.show(data.message, 'error');
                    return;
                }
                snackbarRef?.current?.show(data.message, data.success === true ? 'success' : 'error');
                if (data.success === true) {
                    surveyData.is_published = 1;
                }
            } catch (error: any) {
                setLoading(false);
                snackbarRef?.current?.show(error?.response?.data?.message, 'error');
                if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                    handleLogout();
                }
            }
        }
        props.closeAndUpdate();
    }

    const handleShareSurvey = () => {
        let surveyData = props?.survey;
        navigator.clipboard.writeText(getShareSurveyLink(window.location.host, surveyData?.id));
        snackbarRef?.current?.show('Survey link copied.', 'success');
        props.close();
    }

    const handleDuplicateSurvey = async () => {
        if (!CoreUtils.isComponentVisible(userRole, componentName.CREATE_SURVEY_BUTTON)) {
            snackbarRef?.current?.show('Guests cannot create surveys', 'error');
            props.close();
            return;
        }
        const surveyData = props?.survey;
        const surveyId: string = surveyData.id;
        if (surveyId == null || surveyId.length < 1) {
            snackbarRef?.current?.show('Something went wrong.', 'error');
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.post(duplicateSurveyAPI(surveyId), {}, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data.message, 'success');
            props.updateSurveyList();
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const handleDeleteSurvey = () => {
        if (!CoreUtils.isComponentVisible(userRole, componentName.DELETE_SURVEY)) {
            snackbarRef?.current?.show('You do not have permission to delete survey.', 'error');
            props.close();
            return;
        }
        props.delete(props?.survey?.id);
    }

    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={props.anchor}
                open={props.open}
                onClose={props.close}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleDisableEnableSurvey}>
                    {props?.survey?.is_published === 1 ? 'Unpublish' : 'Publish'}
                </MenuItem>
                <MenuItem onClick={handleShareSurvey}>
                    Share
                </MenuItem >
                <MenuItem onClick={handleDuplicateSurvey} >
                    Duplicate
                </MenuItem>
                <MenuItem onClick={props.changeFolder}>
                    Move to folder
                </MenuItem>
                <MenuItem sx={{ color: 'red' }} onClick={handleDeleteSurvey}>
                    Delete
                </MenuItem>
            </Menu>
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
        </>
    )
}

export default SingleSurveyAction