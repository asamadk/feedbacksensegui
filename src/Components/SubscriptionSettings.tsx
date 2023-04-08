import { Box, Button, Chip, Typography } from '@mui/material'
import * as ButtonStyles from '../Styles/ButtonStyle'
import * as Endpoints from '../Utils/Endpoints';
import * as FeedbackUtils from '../Utils/FeedbackUtils'
import React, { useEffect } from 'react'
import CustomChip from './CustomChip'
import * as LayoutStyles from '../Styles/LayoutStyles'
import axios from 'axios'
import { useNavigate } from 'react-router';


const subscriptionSubContainer = {
    border: '1px #454545 solid',
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
    borderBottom: '1px #454545 solid',
    paddingTop: '10px',
    paddingBottom: '10px'
}

function SubscriptionSettings() {

    let navigate = useNavigate();

    const [subscriptionDetails, setSubscriptionDetail] = React.useState<any>();

    useEffect(() => {
        getSubscriptionDetails();
    },[]);

    const getSubscriptionDetails = async () => {
        let { data } = await axios.get(Endpoints.getSubscriptionDetailHome(FeedbackUtils.getUserId()));
        const isValidated = FeedbackUtils.validateAPIResponse(data);
        if (isValidated === false) {
            return;
        }

        let resData: any[] = data.data;
        if (resData != null) {
            console.log("🚀 ~ file: SurveyListPage.tsx:76 ~ getSubscriptionDetails ~ resData:", resData)
            setSubscriptionDetail(resData);
        }
    }

    const handleUpgradePlanClick = () => {
        navigate('/upgrade/plan');
    }

    return (
        <Box sx={LayoutStyles.globalSettingSubContainers} >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                <Box sx={subscriptionSubContainer} >
                    <Box sx={{ textAlign: 'start' }} >
                        <Typography fontSize={14} >Current subscription : </Typography>
                        <Typography fontSize={24} >{subscriptionDetails?.name}</Typography>
                    </Box>
                    <Box>
                        <CustomChip status={'success'} />
                    </Box>
                </Box>
                <Box sx={{ marginLeft: '20px' }} >
                    <Button sx={ButtonStyles.containedButton} onClick={handleUpgradePlanClick} variant="contained">Upgrade Subscription</Button>
                </Box>
            </Box>

            <Box>
                <Box sx={{ textAlign: 'start', marginTop: '50px', marginBottom: '20px' }} >
                    <Typography color={'#f1f1f1'} fontSize={20} >Subscription Details</Typography>
                </Box>

                <Box sx={subscriptionDetailList} style={{ borderTop: '1px #454545 solid' }} >
                    <Typography color={'#454545'} >Subscription Name </Typography>
                    <Typography color={'#454545'} >{subscriptionDetails?.name}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#454545'} >Billing cycle </Typography>
                    <Typography color={'#454545'} >{subscriptionDetails?.billingCycle}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#454545'} >Next invoice date </Typography>
                    <Typography color={'#454545'} >
                        {new Date(subscriptionDetails?.endDate).toDateString()}
                    </Typography>
                </Box>
                {/* <Box sx={subscriptionDetailList} >
                    <Typography color={'#454545'} >Response usage </Typography>
                    <Typography color={'#454545'} >2/25000 </Typography>
                </Box> */}
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#454545'} >Response usage reset cycle  </Typography>
                    <Typography color={'#454545'} >{subscriptionDetails?.billingCycle}</Typography>
                </Box>
                <Box sx={subscriptionDetailList} >
                    <Typography color={'#454545'} >Survey active   </Typography>
                    <Typography color={'#454545'} >{subscriptionDetails?.surveyLimitUsed + '/' + subscriptionDetails?.totalSurveyLimit}</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default SubscriptionSettings