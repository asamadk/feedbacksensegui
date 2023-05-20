import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Router, Routes, useNavigate } from "react-router-dom";
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
import { USER_LOCAL_KEY } from './Utils/Constants';
import SurveyDisplays from './SurveyEngine/Core/SurveyDisplays';
import { ThemeProvider, createTheme } from '@mui/material';
import TypographyOverride from './Fonts/TypographyOverride';

const globalBodyStyle = {
  backgroundColor: '#1E1E1E',
}

function App() {

  let navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [currentSurveyId, setCurrentSurveyId] = useState('');
  const dataFetchedRef = useRef(false);
  const [liveSurvey, setLiveSurvey] = useState(false);

  const getUser = async () => {
    try {
      let currentPath: string = window.location.pathname;
      if (currentPath.includes('/share/survey/') === true) {
        setLiveSurvey(true);
        return;
      }
      const url = Endpoint.checkLoginStatus();
      const { data } = await axios.get(url, { withCredentials: true });
      if (data.data != null) {
        localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(data.data));
      }

      const currentUser = data.data;
      if (currentUser.organization_id == null || currentUser.organization_id === '') {
        setUser(currentUser);
        navigate('/user/create/organization');
        return;
      }
      setUser(currentUser);
      navigate('/');
    } catch (err) {
      console.error('Error in auth', err);
      localStorage.setItem(USER_LOCAL_KEY, '{}');
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current === true) return;
    getUser();
    dataFetchedRef.current = true;
  }, []);

  const handleUpdateSurveyId = (surveyId: string) => {
    setCurrentSurveyId(surveyId);
  }

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
        {liveSurvey === false && <div style={globalBodyStyle} className="App">
          <Header surveyId={currentSurveyId} loggedIn={user != null} />
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
              element={user ? <CreateSurvey updateSurveyId={handleUpdateSurveyId} /> : <Navigate to={'/login'} />}
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
              <Route path='/share/survey/:surveyId' element={<SurveyDisplays />} />
            </Routes>
          </div>
        </ThemeProvider>
      }
    </>
  );
}

export default App;
