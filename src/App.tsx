import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {  Route, Routes, useLocation, useNavigate } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import AnalyzeSurvey from './Layout/AnalyzeSurvey';
import ConfigureSurvey from './Layout/ConfigureSurvey';
import CreateSurvey from './Layout/CreateSurvey';
import DesignPreview from './Layout/DesignPreview';
import Login from './Layout/Login';
import * as Endpoint from './Utils/Endpoints'
import MainBody from './Layout/MainBody';
import ShareSurvey from './Layout/ShareSurvey';
import UpgradeSubscription from './Layout/UpgradeSubscription';
import LoginSuccess from './Layout/LoginSuccess';
import SurveyDisplays from './SurveyEngine/Core/SurveyDisplays';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import PaymentSuccess from './Components/Stripe/PaymentSuccess';
import TemplateLayout from './Layout/TemplateLayout';
import TemplateDetailLayout from './Layout/TemplateDetailLayout';
import PreviewSurveyLayout from './Layout/PreviewSurveyLayout';
import { useSelector } from 'react-redux';
import HttpFailureComponent from './Components/HttpFailure/HttpFailureComponent';
import ProcessInvite from './Layout/ProcessInvite';
import { ignoreAuthPaths, settingIds } from './Utils/Constants';
import { setUserRole } from './Redux/Actions/userRoleAction';
import { useDispatch } from 'react-redux';
import { setCurrentUsers } from './Redux/Reducers/currentUserReducer';
import Support from './Layout/Support';
import SignUpLayout from './Layout/SignUpLayout';
import IntegrationLayout from './Layout/IntegrationLayout';
import DashboardsLayout from './Layout/DashboardsLayout';
import SideBar from './Components/SideBar';
import SettingsLayout from './Layout/SettingsLayout';
import ContactLayout from './Layout/ContactLayout';
import SegmentLayout from './Layout/SegmentLayout';
import FlowLayout from './Layout/FlowLayout';
import TasksLayout from './Layout/TasksLayout';
import NotificationsLayout from './Layout/NotificationsLayout';
import CompanyDetailPage from './Components/CustomersComponents/CompanyDetailPage';
import PersonDetailPage from './Components/CustomersComponents/PersonDetailPage';
import FlowDetailLayout from './Layout/FlowDetailLayout';
import GlobalAlert from './Components/GlobalAlert';
import GlobalLoader from './Components/GlobalLoader';
import HomeLayout from './Layout/HomeLayout';
import { setLoader } from './Redux/Reducers/LoadingReducer';
import { handleUnAuth } from './Utils/FeedbackUtils';
import { setCompanyList } from './Redux/Reducers/companyReducer';
import { setPeopleOptions } from './Redux/Reducers/peopleOptionReducer';
import { setGlobalStages } from './Redux/Reducers/journeyStageReducer';
import { setGlobalSubStages } from './Redux/Reducers/journeySubStageReducer';
import { setGlobalRiskStages } from './Redux/Reducers/riskStageReducer';
import { showNotification } from './Redux/Reducers/NotificationReducer';
import { setUsers } from './Redux/Reducers/usersReducer';
import { setSubscriptionDetailRedux } from './Redux/Reducers/subscriptionDetailReducer';
import { setCustomSettings } from './Redux/Reducers/customSettingsReducer';
import RedeemLayout from './Layout/RedeemLayout';

function App() {

  let navigate = useNavigate();
  let location = useLocation();

  const defaultColor = useSelector((state: any) => state.colorReducer);
  const globalStage = useSelector((state: any) => state.stage);
  const companiesState = useSelector((state: any) => state.companies);
  const userState = useSelector((state: any) => state.users);
  const subscriptionState = useSelector((state: any) => state.subscriptionDetail);

  const [showLeftBar, setShowLeftBar] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [liveSurvey, setLiveSurvey] = useState(false);
  const dispatch = useDispatch<any>();

  const getUser = async () => {
    try {
      if (user != null) {
        handleLeftBarVisibility();
        return;
      }
      let currentPath: string = window.location.pathname;
      if (currentPath.includes('/share/survey/') === true) {
        setLiveSurvey(true);
        return;
      }
      const url = Endpoint.checkLoginStatus();
      const { data } = await axios.get(url, { withCredentials: true });
      const currentUser = data.data;
      dispatch(setCurrentUsers(currentUser));
      dispatch(setUserRole(currentUser.role));
      if (currentUser.organization_id == null || currentUser.organization_id === '') {
        setUser(currentUser);
        setShowLeftBar(false);
        navigate('/user/create/organization');
        return;
      }
      if (currentUser != null) {
        handleLeftBarVisibility();
      } else {
        setShowLeftBar(false);
        dispatch(setCurrentUsers(null));
      }
      setUser(currentUser);
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 404) {
        navigate(`/failure?message=${err.response?.data?.message}&code=${err?.response?.data?.statusCode}`);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [location.pathname]);

  const handleLeftBarVisibility = () => {
    let currentPath: string = location.pathname;
    if (
      currentPath.includes('/survey/detail/') || 
      currentPath.includes('/flow/detail/') || 
      currentPath.includes('user/create/organization')
    ) {
      setShowLeftBar(false);
    } else {
      setShowLeftBar(true);
    }
  }

  let init = false;

  useEffect(() => {
    if (init === false) {
      initialize();
      init = true;
    }
  }, []);


  async function initialize() {
    try {
      dispatch(setLoader(true));
      await Promise.all([
        fetchCompanyPersonOptions(),
        fetchStages(),
        getUserList(),
        getSubscriptionDetails(),
        fetchCustomSettings()
      ]);
      dispatch(setLoader(false));
    } catch (error) {
      dispatch(setLoader(false));
    }
  }

  async function fetchCompanyPersonOptions() {
    if (companiesState == null || companiesState.length < 1) {
      const { data } = await axios.get(Endpoint.getCompanyPeopleOptionURL(), { withCredentials: true });
      const res = data.data;
      if (res) {
        if (res.companies) {
          dispatch(setCompanyList(res.companies));
        }
        if (res.people) {
          dispatch(setPeopleOptions(res.people));
        }
      }
    }
  }

  async function fetchStages() {
    if (globalStage == null || globalStage.length < 1) {
      const { data } = await axios.get(Endpoint.getJourneyStageURL(), { withCredentials: true });
      if (data.data) {
        const res = data.data;
        dispatch(setGlobalStages(res.stage));
        dispatch(setGlobalSubStages(res.onboarding));
        dispatch(setGlobalRiskStages(res.risk));
      }
    }
  }

  const getUserList = async (): Promise<void> => {
    if (userState == null || userState.length < 1) {
      let { data } = await axios.get(Endpoint.getUserListAPI(), { withCredentials: true });
      if (data?.statusCode !== 200) {
        dispatch(showNotification(data?.message, 'error'));
        return;
      }
      if (data.data != null) {
        dispatch(setUsers(data.data))
      }
    }
  }

  const getSubscriptionDetails = async () => {
    if (subscriptionState == null) {
      let { data } = await axios.get(Endpoint.getSubscriptionDetailHome(), { withCredentials: true });
      if (data.statusCode !== 200) {
        dispatch(showNotification(data?.message, 'error'));
        return;
      }

      let resData: any[] = data.data;
      if (resData != null) {
        dispatch(setSubscriptionDetailRedux(resData));
      }
    }
  }

  const fetchCustomSettings = async () => {
    const { data } = await axios.get(Endpoint.getCustomSettingsAPI(), { withCredentials: true });
    const tempSettings = data?.data;
    dispatch(setCustomSettings(tempSettings));
  }

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
      fontFamily: 'Apercu Pro, sans-serif'
    }
  });

  function AuthHandler(component: JSX.Element): JSX.Element {
    return user ? component : <Login />;
  }

  return (
    <>
      <ThemeProvider theme={lightTheme} >
        {liveSurvey === false &&
          <div style={{ backgroundColor: defaultColor?.backgroundColor }} className="App">
            <Box display={'flex'} >
              {
                user && showLeftBar &&
                <SideBar loggedIn={user != null} />
              }
              <Box width={'100%'} >
                <Header loggedIn={user != null} />
                <Routes>
                  <Route path='/' element={AuthHandler(<HomeLayout />)} />
                  <Route path='/home' element={AuthHandler(<HomeLayout />)} />
                  <Route path='/login' element={AuthHandler(<DashboardsLayout />)} />
                  <Route path='/redeem/appsumo' element={<RedeemLayout/>} />
                  <Route path='/template' element={AuthHandler(<TemplateLayout />)} />
                  <Route path='/settings'>
                    <Route path='home' element={AuthHandler(<SettingsLayout pos={settingIds.HOME} />)} />
                    <Route path='logo' element={AuthHandler(<SettingsLayout pos={settingIds.LOGO} />)} />
                    <Route path='hub' element={AuthHandler(<SettingsLayout pos={settingIds.CUSTOMER_HUB} />)} />
                    <Route path='modeler' element={AuthHandler(<SettingsLayout pos={settingIds.DATA_MODELER} />)} />
                    <Route path='health' element={AuthHandler(<SettingsLayout pos={settingIds.HEALTH_DESIGNER} />)} />
                    <Route path='users' element={AuthHandler(<SettingsLayout pos={settingIds.TEAM} />)} />
                    <Route path='billing' element={AuthHandler(<SettingsLayout pos={settingIds.BILL} />)} />
                    <Route path='ticket' element={AuthHandler(<SettingsLayout pos={settingIds.TICKET} />)} />
                    <Route path='account' element={AuthHandler(<SettingsLayout pos={settingIds.ACCOUNT} />)} />
                    <Route path='redeem' element={AuthHandler(<SettingsLayout pos={settingIds.REDEEM} />)} />
                  </Route>
                  <Route path='/template/details/:templateId' element={AuthHandler(<TemplateDetailLayout />)} />
                  <Route path='/flow/detail/create/:flowId' element={AuthHandler(<FlowDetailLayout />)} />
                  <Route path='/survey/detail/create/:surveyId' element={AuthHandler(<CreateSurvey />)} />
                  <Route path='/survey/detail/design/:surveyId' element={AuthHandler(<DesignPreview />)} />
                  <Route path='/survey/detail/share/:surveyId' element={AuthHandler(<ShareSurvey />)} />
                  <Route path='/survey/detail/analyze/:surveyId' element={AuthHandler(<AnalyzeSurvey />)} />
                  <Route path='/survey/detail/configure/:surveyId' element={AuthHandler(<ConfigureSurvey />)} />
                  <Route path='/upgrade/plan' element={AuthHandler(<UpgradeSubscription />)} />
                  <Route path='/support' element={AuthHandler(<Support />)} />
                  <Route path='/user/create/organization' element={<LoginSuccess />} />
                  <Route path='/integration' element={AuthHandler(<IntegrationLayout />)} />
                  <Route path='/dashboard' element={AuthHandler(<DashboardsLayout />)} />
                  <Route path='/surveys' element={AuthHandler(<MainBody />)} />
                  <Route path='/contacts/companies/detail/:id' element={AuthHandler(<CompanyDetailPage />)} />
                  <Route path='/contacts/person/detail/:id' element={AuthHandler(<PersonDetailPage />)} />
                  <Route path='/segment' element={AuthHandler(<SegmentLayout />)} />
                  <Route path='/flows'>
                    <Route path='publish' element={AuthHandler(<FlowLayout mode='publish' />)} />
                    <Route path='draft' element={AuthHandler(<FlowLayout mode='draft' />)} />
                  </Route>
                  <Route path='/tasks' element={AuthHandler(<TasksLayout />)} />
                  <Route path='/notifications' element={AuthHandler(<NotificationsLayout />)} />
                  <Route path='/companies' element={AuthHandler(<ContactLayout />)} />
                  <Route path='/people' element={AuthHandler(<ContactLayout />)} />
                </Routes>
              </Box>
            </Box>
          </div>}
      </ThemeProvider>

      {liveSurvey === true &&
        <ThemeProvider theme={lightTheme} >
          <Routes>
            <Route path='/share/survey/:effectiveSurveyId' element={<SurveyDisplays source='live' mode='live' />} />
            <Route path='/share/survey/preview/:effectiveSurveyId' element={<PreviewSurveyLayout />} />
          </Routes>
        </ThemeProvider>
      }
      <ThemeProvider theme={lightTheme} >
        <Routes>
          <Route path='/payment/success' element={<PaymentSuccess />} />
          <Route path='/failure' element={<HttpFailureComponent />} />
          <Route path='/invite' element={<ProcessInvite />} />
          <Route path='/sign-up' element={<SignUpLayout />} />
        </Routes>
      </ThemeProvider>

      <GlobalAlert />
      <GlobalLoader />
    </>
  );
}

export default App;
