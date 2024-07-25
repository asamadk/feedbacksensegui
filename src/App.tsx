import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import { ignoreAuthPaths } from './Utils/Constants';
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

function App() {

  let navigate = useNavigate();
  let location = useLocation();

  const defaultColor = useSelector((state: any) => state.colorReducer);
  const [showLeftBar, setShowLeftBar] = useState(true);
  const [user, setUser] = useState<any>(null);
  const dataFetchedRef = useRef(false);
  const [liveSurvey, setLiveSurvey] = useState(false);
  const dispatch = useDispatch<any>();

  const getUser = async () => {
    try {
      if(user != null){
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
      handleLeftBarVisibility();
      setUser(currentUser);
      navigate('/home');
    } catch (err: any) {
      if (err?.response?.data?.statusCode === 404) {
        navigate(`/failure?message=${err.response?.data?.message}&code=${err?.response?.data?.statusCode}`);
      }
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current === true) return;
    let currentPath: string = window.location.pathname;
    if (ignoreAuthPaths.includes(currentPath)) { return; }
    getUser();
    // handleLeftBarVisibility();
    dataFetchedRef.current = true;
  }, []);

  // useEffect(() => {
  //   handleLeftBarVisibility();
  // }, [location.pathname]);

  const handleLeftBarVisibility = () => {
    let currentPath: string = location.pathname;
    if (currentPath.includes('/survey/detail/')) {
      setShowLeftBar(false);
    } else {
      if (user?.organization_id == null || user?.organization_id === '') {
        setShowLeftBar(false);
      } else {
        setShowLeftBar(true);
      }
    }
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
                  <Route path='/template' element={AuthHandler(<TemplateLayout />)} />
                  <Route path='/settings' element={AuthHandler(<SettingsLayout />)} />
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
                  <Route path='/flows' element={AuthHandler(<FlowLayout />)} />
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
