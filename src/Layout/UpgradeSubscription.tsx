import CheckIcon from '@mui/icons-material/Check';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography, Grid, Button, styled, createTheme, ThemeProvider, Box, IconButton, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Switch } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { getAllPlanList, informSupportUserPricingAPI, initializePaymentAPI, startSubScription } from '../Utils/Endpoints';
import { USER_UNAUTH_TEXT, colorPalette } from '../Utils/Constants';
import { handleLogout } from '../Utils/FeedbackUtils';
import FSLoader from '../Components/FSLoader';
import Notification from '../Utils/Notification';
import { loadStripe } from '@stripe/stripe-js';
import { genericModalData } from '../Utils/types';
import GenericModal from '../Modals/GenericModal';
import { containedButton } from '../Styles/ButtonStyle';
import { useSelector } from 'react-redux';
import PlanDetailsTable from '../Components/PlanDetailsTable';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: 'Apercu Pro, sans-serif'
    }
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    typography: {
        fontFamily: 'Apercu Pro, sans-serif'
    }
})

export default function UpgradeSubscription() {

    const snackbarRef: any = useRef(null);

    const [showGenericModal, setShowGenericModal] = React.useState(false);
    const [genericModalObj, setGenericModalObj] = React.useState<genericModalData>();
    const [billing, setBilling] = useState<'month' | 'year'>('year');
    const [selectedPlanCycle, setSelectedPlanCycle] = useState('Yearly');
    const [surveyPlans, setSurveyPlans] = useState<any[]>();
    const [loading, setLoading] = React.useState(false);

    let init = false;

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (init === false) {
            populatePlanCycle();
            getSurveyPlans();
            init = true;
        }
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
            let freePlanId: string | null = null;
            surveyPlans?.forEach(plan => {
                if (plan.price_cents === 0) {
                    freePlanId = plan.id;
                    return;
                }
            });

            if (freePlanId != null) {
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

    const handleGetAccessClick = async (planId: string, price: number) => {
        try {
            setLoading(true);
            const reqBody = {
                price: price,
                planId: planId,
                billing: billing
            }
            const { data } = await axios.post(initializePaymentAPI(), reqBody, { withCredentials: true })
            setLoading(false);
            proceedSubscriptionCheckout(data);
        } catch (error: any) {
            setLoading(false);
            snackbarRef?.current?.show(error?.response?.data?.message, 'error');
            if (error?.response?.data?.message === USER_UNAUTH_TEXT) {
                handleLogout();
            }
        }
    }

    const proceedSubscriptionCheckout = (data: any,) => {
        const reqBody = data.data;
        const subId: string = reqBody?.subId;
        if (reqBody == null || subId == null || subId.length < 1) {
            snackbarRef?.current?.show('Subscription not found, Please contact support', 'error');
            return;
        }
        const options = {
            key: reqBody.key,
            subscription_id: subId,
            name: 'FeedbackSense',
            description: '',
            image: '/Feedback Sense Logo-01.png',
            callback_url: reqBody.callbackURL,
            prefill: {
                name: reqBody.name,
                email: reqBody.email,
            },
            theme: {
                color: colorPalette.primary,
            },
        };

        const win: any = window;
        const rzp = new win.Razorpay(options);
        rzp.open();

        snackbarRef?.current?.show(data?.message, 'success');
    }

    const handleChange = (event: any) => {
        if (event.target.checked === true) {
            setBilling('year');
        } else {
            setBilling('month');
        }
    };

    return (
        <ThemeProvider theme={lightTheme} >
            <Grid container sx={{ overflow: 'scroll', backgroundColor : colorPalette.textSecondary, py: { xs: 2, sm: 3 }, padding: '20px', height: 'calc(100vh - 55px)', }}>
                <IconButton onClick={handleBackButtonClick} >
                    <ArrowBackIcon sx={{ color: colorPalette.darkBackground }} />
                </IconButton>
                <Grid item xs={12} sx={{ mx: 'auto', maxWidth: '2xl', textAlign: { xs: 'center' } }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 3, color: 'text.primary', fontSize: { xs: '3xl', sm: '4xl' } }}>
                        Simple no-tricks pricing
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 'lg', mb: 3 }}>
                        Plan doesn't fits your needs? Contact us to discuss customized solutions.
                    </Typography>
                    <Box sx={{ backgroundColor: colorPalette.darkBackground, borderRadius: '5px', padding: '10px', width: 'fit-content', margin: 'auto' }} >
                        <Typography color={colorPalette.secondary} variant="subtitle1" component="p">
                            If you decide to change your plan again in the future, any remaining balance from your subscription can be
                            claimed through a support ticket.
                        </Typography>
                    </Box>
                    <ThemeProvider theme={lightTheme} >
                        <Box color={colorPalette.textPrimary} >
                            <Typography variant="subtitle1" component="span">Monthly</Typography>
                            &nbsp; <Switch name="checkbox" color="secondary" checked={billing === 'year'} onChange={handleChange} /> &nbsp;
                            <Typography variant="subtitle1" component="span">Yearly</Typography>
                        </Box>
                    </ThemeProvider>
                </Grid>
                {
                    surveyPlans?.map(plan => {
                        return (
                            <SinglePlan
                                handleGetAccessClick={handleGetAccessClick}
                                plan={plan}
                                billing={billing}
                                checkout={() => handleCheckoutClick(plan.id, plan.price_cents)}
                                key={plan?.id}
                            />
                        )
                    })
                }
                <Box sx={{ backgroundColor: colorPalette.darkBackground, borderRadius: '5px', padding: '10px', width: 'fit-content', margin: 'auto' }} >
                    <Typography color={colorPalette.secondary} variant="subtitle1" component="p">
                        Please Note: If you downgrade your plan while having ongoing surveys, all active surveys will be unpublished.
                    </Typography>
                </Box>
                <ThemeProvider theme={lightTheme} >
                    <Box margin={'20px'} width={'100%'}>
                        <PlanDetailsTable />
                    </Box>
                </ThemeProvider>
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


function SinglePlan({ plan, checkout, handleGetAccessClick, billing }: any) {

    const CustomBox = styled(Grid)(({ theme }) => ({
        borderRadius: '10px',
        backgroundColor: colorPalette.textSecondary,
        padding: theme.spacing(2),
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px',
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

    const [planDesc, setPlanDesc] = useState<any>();

    useEffect(() => {
        populateDescription();
    }, []);

    const populateDescription = () => {
        const planDescStr: string = plan?.description;
        setPlanDesc(JSON.parse(planDescStr))
    }

    return (
        <Grid item xs={12} sx={{ mx: 'auto', maxWidth: '7xl', px: { xs: 2, lg: 3 }, padding: '20px' }}>
            <Grid item xs={12} sx={{ backgroundColor : colorPalette.background, textAlign: 'start',boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 4px', mx: 'auto', mt: { xs: 6, sm: 8 }, maxWidth: '2xl', borderRadius: '6px', display: { xs: 'block', lg: 'flex' }, width: { lg: 'none' } }}>
                <Grid item xs={12} lg={7} sx={{ p: 2, padding: '40px' }}>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: '2xl', mb: 3 }}>
                        FeedbackSense {plan?.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: 'base', mb: 3 }}>
                        {planDesc?.description}
                    </Typography>
                    <Grid container spacing={1} alignItems="center" sx={{ mt: 5 }}>
                        <Grid item xs="auto">
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colorPalette.primary, fontSize: 'sm' }}>
                                What's included
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container sx={{ mt: 4 }}>
                        <Grid item xs={12} sm={6}>
                            <Box display={'flex'} marginBottom={'20px'}>
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: colorPalette.primary }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[0]}
                                </Typography>
                            </Box>
                            <Box display={'flex'} >
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: colorPalette.primary }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[1]}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box display={'flex'} marginBottom={'20px'}>
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: colorPalette.primary }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[2]}
                                </Typography>
                            </Box>
                            <Box display={'flex'} >
                                <Box sx={{ marginRight: '20px' }} >
                                    <CheckIcon sx={{ color: colorPalette.primary }} />
                                </Box>
                                <Typography variant="inherit" component="span" sx={{ fontSize: 'sm', color: 'text.secondary' }}>
                                    {planDesc?.features[3]}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={5} sx={{ p: 2 }}>
                    <CustomBox sx={{backgroundColor : colorPalette.secondary}} >
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: 'base' }}>
                            {planDesc?.features[4]}
                        </Typography>
                        <Box display={'flex'} >
                            <Typography variant="h2" sx={{ color: 'text.primary', fontSize: '5xl', mt: 4 }}>
                                ₹{billing === 'year' ? plan?.price_cents : plan?.price_cents_monthly}
                            </Typography>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary', fontSize: 'sm', lineHeight: '10', letterSpacing: 'wide' }}>
                                INR / month
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                Billed {billing}ly
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            style={{ width: '50%' }}
                            sx={containedButton}
                            onClick={() => handleGetAccessClick(plan?.id, plan?.price_cents)}
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

