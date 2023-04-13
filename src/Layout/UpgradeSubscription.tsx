import { Box, Button, ButtonGroup, Divider, IconButton, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as LayoutStyles from '../Styles/LayoutStyles';
import axios from 'axios';
import { getAllPlanList } from '../Utils/Endpoints';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';

function UpgradeSubscription() {

    const snackbarRef: any = useRef(null);

    const [selectedPlanCycle, setSelectedPlanCycle] = useState('Yearly');
    const [surveyPlans, setSurveyPlans] = useState<any>();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        populatePlanCycle();
        getSurveyPlans();
    }, []);

    const getSurveyPlans = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getAllPlanList());
            setLoading(false);
    
            if (data.statusCode !== 200) {                
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }
    
            if (data != null) {
                setSurveyPlans(data.data);
            }
        } catch (error : any ) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
        }
    }

    const populatePlanCycle = () => {
        document.querySelectorAll<HTMLElement>('.cycle').forEach(element => {
            if (element.id === selectedPlanCycle) {
                element.style.backgroundColor = '#1976D2'
                element.style.color = '#f1f1f1';
            } else {
                element.style.background = '#1E1E1E';
                element.style.color = '#1976d2';
            }
        });
    }

    const handleButtonClick = (e: any) => {
        const key = e?.target.id;
        setSelectedPlanCycle(key);
        document.querySelectorAll<HTMLElement>('.cycle').forEach(element => {
            element.style.background = '#1E1E1E';
            element.style.color = '#1976d2';
        });

        e.target.style.backgroundColor = '#1976D2'
        e.target.style.color = '#f1f1f1';
    }

    const handleBackButtonClick = () => {
        window.history.back();
    }

    const buttons = [
        <Button className='cycle' onClick={handleButtonClick} key="Monthly" id='Monthly' >Monthly</Button>,
        <Button className='cycle' onClick={handleButtonClick} key="Quarterly" id='Quarterly'>Quarterly</Button>,
        <Button className='cycle' onClick={handleButtonClick} key="Yearly" id='Yearly' >Yearly - 10%</Button>,
    ];

    return (
        <Box sx={LayoutStyles.settingLayoutStyle} overflow={'scroll'}>
            <Box textAlign={'start'} display={'flex'} justifyContent={'space-between'} >
                <IconButton color='warning' onClick={handleBackButtonClick} >
                    <ArrowBackIcon sx={{ color: '#f1f1f1' }} />
                </IconButton>
                <ButtonGroup color='primary' size="medium" aria-label="small button group">
                    {buttons}
                </ButtonGroup>
                <Box></Box>
            </Box>
            <Box>
            </Box>
            <Box display={'flex'} justifyContent={'space-between'} marginTop={5} >
                {surveyPlans?.map((plan: any) => { return (<SurveyPlan duration={selectedPlanCycle} key={plan.id} plan={plan} />); })}
            </Box>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default UpgradeSubscription

function SurveyPlan({ plan,duration }: any) {

    const [planDesc, setPlanDesc] = useState<any>();

    useEffect(() => {
        populateDescription();
    }, []);

    const populateDescription = () => {
        const planDescStr: string = plan.description;
        setPlanDesc(JSON.parse(planDescStr))
    }

    return (
        <Box padding={'10px'} marginRight={'10px'} width={'33%'} border={'1px #454545 solid'} borderRadius={'5px'}>
            <Typography color={'#f1f1f1'} fontSize={'24px'} marginBottom={'30px'} >{plan.name}</Typography>
            <Box height={'100px'} >
                <Typography color={'#808080'} marginBottom={'20px'} >{planDesc?.description}</Typography>
            </Box>
            <Box display={'flex'} justifyContent={'center'} color={'#f1f1f1'} >
                <Typography sx={{ fontSize: '34px' }} >{'$'}</Typography>
                <Typography sx={{ fontSize: '34px' }} >{plan.price_cents}</Typography>
                <Box sx={{marginTop : '15px', marginLeft : '10px'}} >
                    <Typography sx={{ fontSize: '13px',color : '#808080' }} >{`Billed : ${duration}`}</Typography>
                </Box>
            </Box>
            <Button style={{ marginBottom: '30px',width : '100%', marginTop : '20px' }} color='primary'  variant="contained">Upgrade</Button>
            <Divider sx={{background : '#808080',marginBottom: '30px'}} />
            {planDesc?.features?.map((feat: string, index : number) => {
                return (
                    <Box >
                        <Typography color={'#808080'} fontSize={'14px'} marginBottom={'15px'} textAlign={'start'} >{feat}</Typography>
                        {index === 3 && <Divider sx={{background : '#808080',marginBottom : '15px'}} />}
                    </Box>
                )
            })}
        </Box>
    )
}