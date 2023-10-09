import { Box, Button, Chip, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import React, { useEffect, useRef } from 'react'
import CustomChip from './CustomChip'
import * as LayoutStyles from '../Styles/LayoutStyles'
import axios from 'axios'
import { useNavigate } from 'react-router';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { genericModalData } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import { useSelector } from 'react-redux';


const subscriptionSubContainer = {
    border: '1px #808080 solid',
    color: '#f1f1f1',
    borderRadius: '5px',
    padding: '20px',
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between'
}

const subscriptionDetailList = {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px #808080 solid',
    paddingTop: '10px',
    paddingBottom: '10px'
}

function SubscriptionSettings() {

    let navigate = useNavigate();
    const snackbarRef: any = useRef(null);

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [loading, setLoading] = React.useState(false);
    const [subscriptionDetails, setSubscriptionDetail] = React.useState<any>();
    const defaultColor = useSelector((state: any) => state.colorReducer);

    useEffect(() => {
        getSubscriptionDetails();
    }, []);

    const getSubscriptionDetails = async () => {
        try {
            setLoading(true);
            let { data } = await axios.get(Endpoints.getSubscriptionDetailHome(), { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            let resData: any[] = data.data;
            if (resData != null) {
                setSubscriptionDetail(resData);
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    const handleUpgradePlanClick = () => {
        // navigate('/upgrade/plan');
        window.open('https://www.feedbacksense.io/pricing','__blank')
    }

    const handleCancelSubscription = () => {
        setShowGenericModal(true);
        let genDeleteObj: genericModalData = {
            header: 'Do you really want to cancel your subscription?',
            warning: 'Warning: There\'s no turning back! I acknowledge that',
            successButtonText: 'Proceed',
            cancelButtonText: 'Close',
            description: 'You will still have access to your subscription till end of the current billing period.',
            type: 'cancel'
        }
        setGenericModalObj(genDeleteObj);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'cancel') {
            cancelUserSubscription();
        }
    }

    const cancelUserSubscription = async () => {
        try {
            setLoading(true)
            let { data } = await axios.post(Endpoints.cancelSubScription(), {}, { withCredentials: true });
            setLoading(false);
            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
            snackbarRef?.current?.show(data?.message, 'success');
            getSubscriptionDetails();
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            setLoading(false);
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                FeedbackUtils.handleLogout();
            }
        }
    }

    return (
        <Box sx={LayoutStyles.globalSettingSubContainers(defaultColor?.primaryColor)} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box sx={subscriptionSubContainer} >
                    <Box sx={{ textAlign: 'start' }} >
                        <Typography fontSize={14} >Current subscription : </Typography>
                        <Typography fontSize={24} >{subscriptionDetails?.name}</Typography>
                    </Box>
                    <Box>
                        <Box sx={{ border: '1px #006DFF solid', color: '#006DFF', padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
                            {subscriptionDetails?.status?.substring(0,21)}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ marginLeft: '20px' }} >
                    <Button sx={ButtonStyles.containedButton} onClick={handleUpgradePlanClick} variant="contained">Upgrade Subscription</Button>
                    {/* <Button sx={ButtonStyles.outlinedButton} variant="outlined">Update billing info</Button> */}
                </Box>
            </Box>

            <Box>
                <Box sx={{ textAlign: 'start', marginTop: '50px', marginBottom: '20px' }} >
                    <Typography color={'#f1f1f1'} fontSize={20} >Subscription Details</Typography>
                </Box>

                <Box sx={subscriptionDetailList} style={{ borderTop: '1px #808080 solid' }} >
                    <Typography color={'#808080'} >Subscription Name </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.name}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Billing cycle </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.billingCycle}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Next invoice date </Typography>
                    <Typography color={'#808080'} >
                        {subscriptionDetails?.endDate}
                    </Typography>
                </Box>
                {/* <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Response usage </Typography>
                    <Typography color={'#808080'} >2/25000 </Typography>
                </Box> */}
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Response usage reset cycle  </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.billingCycle}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Survey active   </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.surveyLimitUsed + '/' + subscriptionDetails?.totalSurveyLimit}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Survey response capacity  </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.responseCapacity}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#808080'} >Survey response store limit  </Typography>
                    <Typography color={'#808080'} >{subscriptionDetails?.responseStoreLimit}</Typography>
                </Box>
                {/* <Box width={'fit-content'} >
                    <Typography
                        sx={{ color: '#808080', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer', marginTop: '20px' }}
                        onClick={handleCancelSubscription}
                    >Cancel Subscription</Typography>
                </Box> */}
            </Box>
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </Box>
    )
}

export default SubscriptionSettings