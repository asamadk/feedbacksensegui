import { Box, Button, Chip, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import React, { useEffect, useRef, useState } from 'react'
import * as LayoutStyles from '../Styles/LayoutStyles'
import { useNavigate } from 'react-router';
import FSLoader from './FSLoader';
import Notification from '../Utils/Notification';
import { colorPalette, componentName } from '../Utils/Constants';
import { genericModalData, userRoleType } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import { useSelector } from 'react-redux';
import UnAuthorisedComponent from './UnauthorisedComponent';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';
import PaymentHistoryModal from '../Modals/PaymentHistoryModal';

function SubscriptionSettings() {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();
    const userRole: userRoleType = useSelector((state: any) => state.userRole);

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [loading, setLoading] = React.useState(false);
    const [openHistory, setOpenHistory] = useState(false);
    const defaultColor = useSelector((state: any) => state.colorReducer);
    const subscriptionState = useSelector((state: any) => state.subscriptionDetail);

    const handleUpgradePlanClick = () => {
        navigate('/upgrade/plan');
        // window.open('https://www.feedbacksense.io/pricing', '__blank')
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
    }

    const handleCancelSubscription = () => {
        window.open('https://www.feedbacksense.io/ticket', '__blank')
    }

    const subscriptionSubContainer = {
        color: colorPalette.darkBackground,
        borderRadius: '5px',
        backgroundColor: colorPalette.textSecondary,
        padding: '20px',
        width: '80%',
        display: 'flex',
        justifyContent: 'space-between',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }

    const subscriptionDetailList = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
        backgroundColor: colorPalette.textSecondary,
        borderRadius: '5px',
        padding: '10px 20px',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px'
    }

    return (
        <Box sx={{...LayoutStyles.globalSettingSubContainers(colorPalette.background),height : 'calc(100vh - 80px)'}} >
            {
                CoreUtils.isComponentVisible(userRole, componentName.SUBSCRIPTION) ?
                    <>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                            <Box sx={subscriptionSubContainer} >
                                <Box sx={{ textAlign: 'start' }} >
                                    <Typography fontSize={14} >Current subscription : </Typography>
                                    <Typography fontSize={24} >{subscriptionState?.name}</Typography>
                                </Box>
                                <Box>
                                    <Box sx={{ border: `1px ${colorPalette.primary} solid`, color: colorPalette.primary, padding: '5px 15px', fontSize: 12, borderRadius: 2 }} >
                                        {subscriptionState?.status?.substring(0, 21)}
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ marginLeft: '20px', width: '200px' }} >
                                <Button
                                    sx={ButtonStyles.containedButton}
                                    onClick={handleUpgradePlanClick}
                                    variant="contained"
                                >Upgrade Subscription</Button>
                                <Button
                                    sx={ButtonStyles.outlinedButton}
                                    onClick={() => setOpenHistory(true)}
                                    variant="outlined"
                                >View Payment History</Button>
                            </Box>
                        </Box>

                        <Box >
                            <Box sx={{ textAlign: 'start', marginTop: '50px', marginBottom: '20px' }} >
                                <Typography color={colorPalette.darkBackground} fontSize={20} >Subscription Details</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Subscription Name </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.name}</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Billing cycle </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.billingCycle}</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Next invoice date </Typography>
                                <Typography color={colorPalette.textPrimary} >
                                    {new Date(subscriptionState?.nextInvoice * 1000).toDateString()}
                                </Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Response usage reset cycle  </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.billingCycle}</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Survey active   </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.surveyLimitUsed + '/' + subscriptionState?.totalSurveyLimit}</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Survey response capacity  </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.responseCapacity}</Typography>
                            </Box>
                            <Box sx={subscriptionDetailList} >
                                <Typography color={colorPalette.textPrimary} >Survey response store limit  </Typography>
                                <Typography color={colorPalette.textPrimary} >{subscriptionState?.responseStoreLimit}</Typography>
                            </Box>
                            <Box textAlign={'start'} marginTop={'10px'}>
                                <Typography
                                    onClick={handleCancelSubscription}
                                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    color={colorPalette.primary}
                                >Cancel Subscription</Typography>
                            </Box>
                        </Box>
                    </> :
                    <UnAuthorisedComponent color={colorPalette.textPrimary} />
            }
            <Notification ref={snackbarRef} />
            <FSLoader show={loading} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
            {
                openHistory &&
                <PaymentHistoryModal
                    open={openHistory}
                    close={() => setOpenHistory(false)}
                />
            }
        </Box>
    )
}

export default SubscriptionSettings