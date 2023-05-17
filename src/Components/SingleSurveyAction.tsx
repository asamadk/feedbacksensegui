import { Box, Menu, MenuItem, ThemeProvider, Typography, createTheme } from '@mui/material'
import axios from 'axios'
import React, { useRef } from 'react'
import { disableSurvey, enableSurvey, getShareSurveyLink, shareSurvey } from '../Utils/Endpoints'
import Notification from '../Utils/Notification'
import CustomAlert from './CustomAlert'
import FSLoader from './FSLoader'
import { USER_UNAUTH_TEXT } from '../Utils/Constants'
import { useNavigate } from 'react-router'
import { handleLogout } from '../Utils/FeedbackUtils'

function SingleSurveyAction(props: any) {

    const [loading, setLoading] = React.useState(false);
    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();

    const handleDisableEnableSurvey = async (e: any) => {
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
                if(error?.response?.data?.message === USER_UNAUTH_TEXT){
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
                if(error?.response?.data?.message === USER_UNAUTH_TEXT){
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
                    {props?.survey?.is_published === 1 ? 'Disable' : 'Enable'}
                </MenuItem>
                <MenuItem onClick={handleShareSurvey}>
                    Share
                </MenuItem>
                <MenuItem sx={{ cursor: 'not-allowed' }} >
                    Duplicate
                </MenuItem>
                <MenuItem onClick={props.changeFolder}>
                    Move to folder
                </MenuItem>
                <MenuItem sx={{color : 'red'}} onClick={() => props.delete(props?.survey?.id)}>
                    Delete
                </MenuItem>
            </Menu>
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
        </>
    )
}

export default SingleSurveyAction