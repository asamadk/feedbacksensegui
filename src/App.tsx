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
import ProductUsageConnect from './Components/ProductUsageConnect';
import CustomEventsView from './Components/CustomEventsView';
import CustomerJourneyModeler from './Components/CustomerJourneyModeler';
import CompaniesComponent from './Components/CustomersComponents/CompaniesComponent';
import PeopleComponent from './Components/CustomersComponents/PeopleComponent';

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
      const freeTypeWindow: any = window;
      freeTypeWindow.feedbacksense.track('login');
      setUser(currentUser);
      navigate('/');
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
    handleLeftBarVisibility();
    dataFetchedRef.current = true;
  }, []);

  useEffect(() => {
    handleLeftBarVisibility();
  }, [location.pathname]);

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

  return (
    <>
      <ThemeProvider theme={lightTheme} >
        {liveSurvey === false && <div style={{ backgroundColor: defaultColor?.backgroundColor }} className="App">
          <Box display={'flex'} >
            {
              user && showLeftBar &&
              <SideBar loggedIn={user != null} />
            }
            <Box width={'100%'} >
              <Header loggedIn={user != null} />
              <Routes>
                <Route
                  path='/'
                  element={user ? <DashboardsLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/login'
                  element={user ? <DashboardsLayout /> : <Login />}
                />
                <Route
                  path='/template'
                  element={user ? <TemplateLayout /> : <Login />}
                />
                <Route
                  path='/settings'
                  element={user ? <SettingsLayout /> : <Login />}
                />
                <Route
                  path='/template/details/:templateId'
                  element={user ? <TemplateDetailLayout /> : <Login />}
                />
                <Route
                  path='/survey/detail/create/:surveyId'
                  element={user ? <CreateSurvey /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/survey/detail/design/:surveyId'
                  element={user ? <DesignPreview /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/survey/detail/share/:surveyId'
                  element={user ? <ShareSurvey /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/survey/detail/analyze/:surveyId'
                  element={user ? <AnalyzeSurvey /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/survey/detail/configure/:surveyId'
                  element={user ? <ConfigureSurvey /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/upgrade/plan'
                  element={user ? <UpgradeSubscription /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/support'
                  element={user ? <Support /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/user/create/organization'
                  element={<LoginSuccess />}
                />
                <Route
                  path='/integration'
                  element={user ? <IntegrationLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/dashboard'
                  element={user ? <DashboardsLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/surveys'
                  element={user ? <MainBody /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/contacts/companies/detail/:id'
                  element={user ? <CompanyDetailPage /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/contacts/person/detail/:id'
                  element={user ? <PersonDetailPage /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/segment'
                  element={user ? <SegmentLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/flows'
                  element={user ? <FlowLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/tasks'
                  element={user ? <TasksLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/notifications'
                  element={user ? <NotificationsLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/companies'
                  element={user ? <ContactLayout /> : <Navigate to={'/login'} />}
                />
                <Route
                  path='/people'
                  element={user ? <ContactLayout /> : <Navigate to={'/login'} />}
                />
              </Routes>
            </Box>
          </Box>
        </div>}
      </ThemeProvider>
      {liveSurvey === true &&
        <ThemeProvider theme={lightTheme} >
          <div>
            <Routes>
              <Route path='/share/survey/:effectiveSurveyId' element={<SurveyDisplays source='live' mode='live' />} />
            </Routes>
            <Routes>
              <Route path='/share/survey/preview/:effectiveSurveyId' element={<PreviewSurveyLayout />} />
            </Routes>
          </div>
        </ThemeProvider>
      }
      <ThemeProvider theme={lightTheme} >
        <Routes>
          <Route
            path='/payment/success'
            element={<PaymentSuccess />}
          />
          <Route
            path='/failure'
            element={<HttpFailureComponent />}
          />
          <Route
            path='/invite'
            element={<ProcessInvite />}
          />
          <Route
            path='/sign-up'
            element={<SignUpLayout />}
          />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
