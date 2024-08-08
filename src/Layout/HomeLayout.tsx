import { Box, Button, createTheme, Step, StepLabel, Stepper, Table, TableCell, TableContainer, TableHead, TableRow, ThemeProvider, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { colorPalette } from '../Utils/Constants'
import { containedButton, outlinedButton, outlinedButtonNoBorder } from '../Styles/ButtonStyle'
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setLoader } from '../Redux/Reducers/LoadingReducer';
import { getRandomNumber, handleUnAuth } from '../Utils/FeedbackUtils';
import { endpoints, getCompanyPeopleOptionURL, getCustomSettingsAPI, getJourneyStageURL, getSubscriptionDetailHome, getUserListAPI } from '../Utils/Endpoints';
import axios from 'axios';
import { useCases } from '../StaticResources/useCases';
import YouTubeIcon from '@mui/icons-material/YouTube';
import RouteIcon from '@mui/icons-material/Route';
import OnboardingVideoModal from '../Components/OnboardingVideoModal';
import { setCustomSettings } from '../Redux/Reducers/customSettingsReducer';

function HomeLayout() {

  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.currentUser);
  const [stepVal, setStepVal] = useState(2);
  const [showVideo, setShowVideo] = useState(false);
  const [todayDate,setTodayDate] = useState(new Date().toDateString());

  useEffect(() => {
    getOnboardingStatus();
    setTodayDate(new Date().toDateString())
  }, []);

  async function getOnboardingStatus() {
    try {
      dispatch(setLoader(true));
      const { data } = await axios.get(endpoints.home.onboarding, { withCredentials: true })
      if (data.data) {
        setStepVal(data.data);
      }
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
      handleUnAuth(error);
    }
  }

  const theme = createTheme({
    components: {
      MuiStepIcon: {
        styleOverrides: {
          root: {
            '&.Mui-active': {
              color: colorPalette.primary, // active step color (purple)
            },
            '&.Mui-completed': {
              color: colorPalette.primary, // completed step color (purple)
            },
          },
        },
      },
    },
  });

  const steps = [
    'Fill Company Details',
    'Create first company',
    'Create first person',
    'Create first automation'
  ];

  const [useCase, setUseCase] = useState<any[]>([]);

  useEffect(() => {
    populateUseCases();
  }, []);

  function populateUseCases() {
    setUseCase([]);
    const tmp = [];
    for (let i = 0; i <= 6; i++) {
      const index = getRandomNumber(14);
      tmp.push(useCases[index]);
    }
    setUseCase(tmp);
  }

  const whatsNew = [
    {
      label: 'News Feed',
      data: [
        { label: 'Understanding Churn Prediction and Its Importance for SaaS Businesses', url: 'https://retainsense.com/blogs/churnprediction' },
        { label: 'Stop Customer Churn: 5 Strategies to reduce customer churn', url: 'https://retainsense.medium.com/stop-customer-churn-5-strategies-to-reduce-customer-churn-8d4bb281a2ea' },
      ]
    },
    {
      label: 'Feature Highlight',
      data: [
        { label: useCases[getRandomNumber(14)].heading, url: 'https://retainsense.com/product' },
        { label: useCases[getRandomNumber(14)].heading, url: 'https://retainsense.com/product' },
      ]
    },
    {
      label: 'Release Notes',
      data: [
        { label: 'Version 1.0.0: Pilot release', url: 'https://help.retainsense.com' }
      ]
    }
  ];

  return (
    <Box height={'calc(100vh - 22px)'} sx={{ overflowY: 'auto' }} p={'10px'} >

      <Box display={'flex'} justifyContent={'space-between'}>
        <Box m={2} textAlign={'start'} >
          <Typography variant='h6' fontWeight={600} >Welcome back, {user.name}</Typography>
          <Typography fontSize={'small'} color={colorPalette.fsGray} >{todayDate}</Typography>
        </Box>
        <Box m={2} display={'flex'} >
          <Box >
            <Button
              onClick={() => setShowVideo(true)}
              endIcon={<YouTubeIcon />}
              sx={{ ...containedButton, marginTop: 0 }}
            >
              Try Demo
            </Button>
          </Box>
          <Box marginLeft={'10px'}>
            <Button
              onClick={() => window.open('https://goos.ly/clynbtybg35810341n6feoi5qdv', '__blank')}
              endIcon={<RouteIcon />}
              sx={{ ...outlinedButton, marginTop: 0 }}
            >
              Explore Roadmap
            </Button>
          </Box>
        </Box>
      </Box>

      <Box m={2} >
        <ThemeProvider theme={theme}>
          <Stepper activeStep={stepVal} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel color='#006dff' >{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </ThemeProvider>
      </Box>

      <Box m={2} display={'flex'} justifyContent={'space-around'}>
        <Box marginTop={'50px'} width={'47%'} textAlign={'start'} >
          <Typography fontSize={'20px'} fontWeight={600} >Explore more use cases</Typography>
          <Typography color={colorPalette.fsGray} fontSize={'small'} >
            Explore how you can make the most out of RetainSense
          </Typography>

          <Box sx={{ marginTop: '10px' }} >
            {
              useCase?.map(u =>
                <Box
                  key={u?.id}
                  borderRadius={'5px'}
                  sx={{ background: colorPalette.textSecondary, p: 1 }}
                  marginTop={'10px'}
                  display={'flex'}
                >
                  <Box sx={{ background: 'white', borderRadius: '5px', width: '45px', textAlign: 'center' }} >
                    <WbIncandescentIcon sx={{ color: colorPalette.primary, marginTop: '7px' }} />
                  </Box>
                  <Box marginLeft={'10px'} >
                    <Typography sx={{ textOverflow: 'ellipsis' }} fontSize={'small'} >
                      {u?.heading}
                    </Typography>
                    <Typography
                      marginTop={0}
                      width={'fit-content'}
                      sx={{ color: colorPalette.fsGray, textDecoration: 'underline', cursor: 'pointer' }} fontSize={'small'}
                      onClick={() => window.open('https://retainsense.com/product', '__blank')}
                    >
                      View More
                    </Typography>
                  </Box>
                </Box>
              )
            }
          </Box>
        </Box>

        <Box marginTop={'50px'} width={'47%'} textAlign={'start'} >
          <Typography fontSize={'20px'} fontWeight={600} >What's New</Typography>
          <Typography color={colorPalette.fsGray} fontSize={'small'} >
            Get notified of our latest features and updates
          </Typography>
          {whatsNew.map(info =>
            <Box sx={{ background: colorPalette.textSecondary, p: 2, borderRadius: '5px', marginTop: '15px' }} >
              <Box display={'flex'} justifyContent={'space-between'} >
                <Typography fontWeight={600} >{info.label}</Typography>
                {/* <Button size='small' sx={{ ...containedButton, width: 'fit-content', m: 0 }} >Details</Button> */}
              </Box>
              {info.data.map(d =>
                <Box marginLeft={'10px'} >
                  <Typography fontSize={'small'} >{d.label}</Typography>
                  <Typography
                    marginTop={0}
                    width={'fit-content'}
                    sx={{ color: colorPalette.fsGray, textDecoration: 'underline', cursor: 'pointer' }} fontSize={'small'}
                    onClick={() => window.open(d.url, '__blank')}
                  >
                    View More
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          <Button
            onClick={() => window.open('https://help.retainsense.com')}
            sx={outlinedButton}
          >
            Explore documentation
          </Button>
        </Box>
      </Box>
      {
        showVideo &&
        <OnboardingVideoModal open={showVideo} close={() => setShowVideo(false)} />
      }
    </Box>
  )
}

export default HomeLayout