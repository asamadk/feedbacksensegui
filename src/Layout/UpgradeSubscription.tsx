import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography, Grid, Button, styled, createTheme, ThemeProvider, Box, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getAllPlanList, startSubScription } from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { loadStripe } from '@stripe/stripe-js';
import { genericModalData } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import { containedButton } from '../Styles/ButtonStyle';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Apercu Pro, sans-serif'
    }
});

const CustomBox = styled(Grid)(({ theme }) => ({
    borderRadius: '10px',
    backgroundColor: '#29292a',
    padding: theme.spacing(2),
    textAlign: 'center',
    boxShadow: `inset 0 0 0 1px ${theme.palette.grey[900]}05`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('lg')]: {
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(4),
    },
}));

export default function UpgradeSubscription() {

    const snackbarRef: any = useRef(null);
    const navigate = useNavigate();

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();

    const [selectedPlanCycle, setSelectedPlanCycle] = useState('Yearly');
    const [surveyPlans, setSurveyPlans] = useState<any[]>();
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        populatePlanCycle();
        getSurveyPlans();
    }, []);

    const getSurveyPlans = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(getAllPlanList(), { withCredentials: true });
            setLoading(false);

            if (data.statusCode !== 200) {
                snackbarRef?.current?.show(data?.message, 'error');
                return;
            }

            if (data != null) {
                setSurveyPlans(data.data);
            }
        } catch (error: any) {
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
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

    const handleBackButtonClick = () => {
        window.history.back();
    }

    const handleCheckoutClick = (planId: string, amount: number) => {
        // navigate(`/checkout/${planId}`);
        handleSubscribe(planId, amount);
    }

    const handleSuccessButtonClick = () => {
        setShowGenericModal(false);
        if (genericModalObj?.type === 'cancel') {
            let freePlanId : string | null = null;
            surveyPlans?.forEach(plan => {
                if (plan.price_cents === 0) {
                    freePlanId = plan.id;
                    return;
                }
            });

            if(freePlanId != null){
                runChangeSubscription(freePlanId, 0);
            }
        }
    }

    const handleSubscribe = async (planId: string, amount: number) => {
        if (amount === 0) {
            setShowGenericModal(true);
            let genDeleteObj: genericModalData = {
                header: 'Do you really want to go back to the free plan?',
                warning: 'Warning: There\'s no turning back! I acknowledge that',
                successButtonText: 'Proceed',
                cancelButtonText: 'Close',
                description: 'You will still have access to your subscription till end of the current billing period.',
                type: 'cancel'
            }
            setGenericModalObj(genDeleteObj);
            return;
        }
        runChangeSubscription(planId, amount);
    };

    const runChangeSubscription = async (planId: string, amount: number) => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                startSubScription(),
                { amount: amount, localPlanId: planId },
                { withCredentials: true }
            );
            const sessionId = data?.sessionId;
            const stripe = await stripePromise;
            const { error }: any = await stripe?.redirectToCheckout({ sessionId });
            if (error) {
                snackbarRef?.current?.show(error?.message, 'error');
            }
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }


    return (
        <ThemeProvider theme={darkTheme} >
            <Grid container sx={{ overflow: 'scroll', py: { xs: 2, sm: 3 }, padding: '20px', height: 'calc(100vh - 55px)', }}>
                <IconButton onClick={handleBackButtonClick} color='info'  >
                    <ArrowBackIcon sx={{ color: '#f1f1f1' }} />
                </IconButton>
                <Grid item xs={12} sx={{ mx: 'auto', maxWidth: '2xl', textAlign: { xs: 'center' } }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary', fontSize: { xs: '3xl', sm: '4xl' } }}>
                        Simple no-tricks pricing
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 'lg', mb: 3 }}>
                        Plan doesn't fits your needs? Contact us to discuss customized solutions.
                    </Typography>
                </Grid>
                {
                    surveyPlans?.map(plan => {
                        return (
                            <SinglePlan plan={plan} checkout={() => handleCheckoutClick(plan.id, plan.price_cents)} key={plan.id} />
                        )
                    })
                }
                <PlanDetailsTable />
            </Grid>
            <FSLoader show={loading} />
            <Notification ref={snackbarRef} />
            <GenericModal
                payload={genericModalObj}
                close={() => setShowGenericModal(false)}
                open={showGenericModal}
                callback={handleSuccessButtonClick}
            />
        </ThemeProvider>
    );
}


function SinglePlan({ plan, checkout }: any) {


    const [planDesc, setPlanDesc] = useState<any>();

    useEffect(() => {
        populateDescription();
    }, []);

    const populateDescription = () => {
        const planDescStr: string = plan.description;
        setPlanDesc(JSON.parse(planDescStr))
    }

    return (
        <Grid item xs={12} sx={{ mx: 'auto', maxWidth: '7xl', px: { xs: 2, lg: 3 }, padding: '20px' }}>

            <Grid item xs={12} sx={{ textAlign: 'start', border: '1px #454545 solid', mx: 'auto', mt: { xs: 6, sm: 8 }, maxWidth: '2xl', borderRadius: '6px', display: { xs: 'block', lg: 'flex' }, width: { lg: 'none' } }}>
                <Grid item xs={12} lg={7} sx={{ p: 2, padding: '40px' }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '2xl', mb: 3 }}>
                        FeedbackSense {plan.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 'base', mb: 3 }}>
                        {planDesc?.description}
                    </Typography>
                    <Grid container spacing={1} alignItems="center" sx={{ mt: 5 }}>
                        <Grid item xs="auto">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#006DFF', fontSize: 'sm' }}>
                                What's included
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <Box display={'flex'} marginBottom={'20px'}>
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: '#006DFF' }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[0]}
                                </Typography>
                            </Box>
                            <Box display={'flex'} >
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: '#006DFF' }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[1]}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display={'flex'} marginBottom={'20px'}>
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: '#006DFF' }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[2]}
                                </Typography>
                            </Box>
                            <Box display={'flex'} >
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: '#006DFF' }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[3]}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={5} sx={{ p: 2 }}>
                    <CustomBox>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: 'base' }}>
                            {planDesc?.features[4]}
                        </Typography>
                        <Box display={'flex'} >
                            <Typography variant="h2" sx={{ color: 'text.primary', fontSize: '5xl', mt: 4 }}>
                                ${plan.price_cents}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: 'sm', lineHeight: '10', letterSpacing: 'wide' }}>
                                USD / year
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            style={{width : '50%'}}
                            sx={containedButton}
                            onClick={() => checkout(plan.id, plan.price_cents)}
                        >
                            Get access
                        </Button>
                        <Typography variant="subtitle2" sx={{ mt: 2, fontSize: 'xs', lineHeight: '5', color: 'text.secondary' }}>
                            Invoices and receipts available for easy company reimbursement
                        </Typography>
                    </CustomBox>
                </Grid>
            </Grid>
        </Grid>
    )
}


function PlanDetailsTable() {
    return (
        <TableContainer style={{ margin: '35px' }} component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Feature</TableCell>
                        <TableCell>Free $0 /year</TableCell>
                        <TableCell>Starter $25 /year</TableCell>
                        <TableCell>Growth $49 /year</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Active surveys</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>10</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Users</TableCell>
                        <TableCell>1</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Response capacity / survey</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>2000</TableCell>
                        <TableCell>5000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Response store limit</TableCell>
                        <TableCell>50</TableCell>
                        <TableCell>2000</TableCell>
                        <TableCell>5000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Folders</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Personalized assistance</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Questions in survey</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Detailed analysis</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>AI analysis</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Collection time / survey</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                        <TableCell>Unlimited</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Notifications</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Email support</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Exclusive Features</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                        <TableCell><CheckIcon sx={{ color: '#006DFF' }} /></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Result export</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell>Coming soon</TableCell>
                        <TableCell>Coming soon</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Custom logo</TableCell>
                        <TableCell><RemoveIcon /></TableCell>
                        <TableCell>Coming soon</TableCell>
                        <TableCell>Coming soon</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}