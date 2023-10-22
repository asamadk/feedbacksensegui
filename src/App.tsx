import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import AnalyzeSurvey from './Layout/AnalyzeSurvey';
import ConfigureSurvey from './Layout/ConfigureSurvey';
import CreateSurvey from './Layout/CreateSurvey';
import DesignPreview from './Layout/DesignPreview';
import Login from './Layout/Login';
import * as Endpoint from './Utils/Endpoints'
import MainBody from './Layout/MainBody';
import OrgSettings from './Layout/OrgSettings';
import ShareSurvey from './Layout/ShareSurvey';
import SurveySettings from './Layout/SurveySettings';
import UpgradeSubscription from './Layout/UpgradeSubscription';
import LoginSuccess from './Layout/LoginSuccess';
import SurveyDisplays from './SurveyEngine/Core/SurveyDisplays';
import { ThemeProvider, createTheme } from '@mui/material';
import PaymentSuccess from './Components/Stripe/PaymentSuccess';
import TemplateLayout from './Layout/TemplateLayout';
import TemplateDetailLayout from './Layout/TemplateDetailLayout';
import PreviewSurveyLayout from './Layout/PreviewSurveyLayout';
import { useSelector } from 'react-redux';
import HttpFailureComponent from './Components/HttpFailure/HttpFailureComponent';
import { handleLogout } from './Utils/FeedbackUtils';
import ProcessInvite from './Layout/ProcessInvite';
import { ignoreAuthPaths } from './Utils/Constants';
import { setUserRole } from './Redux/Actions/userRoleAction';
import { useDispatch } from 'react-redux';
import { setCurrentUsers } from './Redux/Reducers/currentUserReducer';

function App() {

  let navigate = useNavigate();

  const defaultColor = useSelector((state: any) => state.colorReducer);
  const [user, setUser] = useState(null);
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
        navigate('/user/create/organization');
        return;
      }
      setUser(currentUser);
      navigate('/');
    } catch (err: any) {
      if(err?.response?.data?.statusCode === 404){
        navigate(`/failure?message=${err.response?.data?.message}&code=${err?.response?.data?.statusCode}`);
      }
      console.error('Error in auth', err);
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current === true) return;
    let currentPath: string = window.location.pathname;
    if(ignoreAuthPaths.includes(currentPath)){return;}
    getUser();
    dataFetchedRef.current = true;
  }, []);

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
  });

  return (
    <>
      <ThemeProvider theme={darkTheme} >
        {liveSurvey === false && <div style={{ backgroundColor: defaultColor?.backgroundColor }} className="App">
          <Header loggedIn={user != null} />
          <Routes>
            <Route
              path='/'
              element={user ? <MainBody /> : <Navigate to={'/login'} />}
            />
            <Route
              path='/login'
              element={user ? <MainBody /> : <Login />}
            />
            <Route
              path='/template'
              element={user ? <TemplateLayout /> : <Login />}
            />
            <Route
              path='/template/details/:templateId'
              element={user ? <TemplateDetailLayout /> : <Login />}
            />
            <Route
              path='/org/general'
              element={user ? <OrgSettings tabset={0} /> : <Navigate to={'/login'} />}
            />
            <Route
              path='/org/teammates'
              element={user ? <OrgSettings tabset={1} /> : <Navigate to={'/login'} />}
            />
            <Route
              path='/org/subscription'
              element={user ? <OrgSettings tabset={2} /> : <Navigate to={'/login'} />}
            />
            <Route
              path='/survey/global/settings/general'
              element={user ? <SurveySettings tabset={0} /> : <Navigate to={'/login'} />}
            />
            <Route
              path='/survey/global/settings/web'
              element={user ? <SurveySettings tabset={1} /> : <Navigate to={'/login'} />}
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
              path='/user/create/organization'
              element={<LoginSuccess />}
            />
          </Routes>
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
      </Routes>
    </>
  );
}

export default App;
