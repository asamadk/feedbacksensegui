import { Box, Button, ButtonGroup, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as LayoutStyles from '../Styles/LayoutStyles';
import axios from 'axios';
import { getAllPlanList } from '../Utils/Endpoints';
import { validateAPIResponse } from '../Utils/FeedbackUtils';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FSLoader from '../Components/FSLoader';

function UpgradeSubscription() {

    const [selectedPlanCycle, setSelectedPlanCycle] = useState('Yearly');
    const [surveyPlans , setSurveyPlans] = useState<any>();
    const [ loading , setLoading] = React.useState(false);

    useEffect(() => {
        populatePlanCycle();
        getSurveyPlans();
    },[]);

    const getSurveyPlans = async() => {

        setLoading(true);
        const { data } = await axios.get(getAllPlanList());
        setLoading(false);
        
        const isvalidated = validateAPIResponse(data);
        if(isvalidated === false){
            //TODO show error
        }

        if(data != null){
            setSurveyPlans(data.data);
        }
    }

    const populatePlanCycle = () => {
        document.querySelectorAll<HTMLElement>('.cycle').forEach(element => {
            if(element.id === selectedPlanCycle){
                element.style.backgroundColor = '#1976D2'
                element.style.color = '#f1f1f1';
            }else{
                element.style.background = '#1E1E1E';
                element.style.color = '#1976d2';
            }
        });
    }

    const handleButtonClick = (e : any) => {
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
        <Box sx={LayoutStyles.settingLayoutStyle}  overflow={'scroll'}>
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
                {surveyPlans?.map((plan : any) => {return(<SurveyPlan key={plan.id} plan={plan} />);})}
            </Box>
            <FSLoader show={loading} />
        </Box>
    )
}

export default UpgradeSubscription

function SurveyPlan({ plan } : any ){
    return(
        <Box padding={'10px'} width={'30%'} border={'1px #454545 solid'} borderRadius={'5px'}>
            <Typography color={'#f1f1f1'} fontSize={'24px'} marginBottom={'30px'} >{plan.name}</Typography>
            <Typography color={'#454545'} marginBottom={'20px'} >{'Basic description it will change later'}</Typography>
            <Box display={'flex'} color={'#f1f1f1'} textAlign={'start'} >
                <AttachMoneyIcon sx={{ width : '34px', padding : 0}} />
                <Typography sx={{ fontSize : '34px'}} >{plan.price_cents}</Typography>
            </Box>
        </Box>
    )
}