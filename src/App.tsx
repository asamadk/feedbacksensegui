import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SurveyThemeSelector from './Components/SurveyThemeSelector';
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
import { SURVEY_LOCAL_KEY, USER_LOCAL_KEY } from './Utils/Constants';

const globalBodyStyle = {
  backgroundColor: '#1E1E1E',
}

function App() {

  const [user, setUser] = useState(null);
  const dataFetchedRef = useRef(false);

  const getUser = async () => {
    try {
      const url = Endpoint.checkLoginStatus();
      const { data } = await axios.get(url, { withCredentials: true });
      if(data.data != null){
        localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(data.data));
      }
      localStorage.removeItem(SURVEY_LOCAL_KEY);
      setUser(data.data);
    } catch (err) {
      console.log('Error in auth',err);
      localStorage.setItem(USER_LOCAL_KEY,'{}');
      localStorage.removeItem(SURVEY_LOCAL_KEY);
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current === true) return;
		getUser();
    dataFetchedRef.current = true;
	}, []);

  return (
    <div style={globalBodyStyle} className="App">
      <Header loggedIn={user != null} />
      <Routes>
        <Route path='/' element={user ?  <MainBody /> : <Navigate to={'/login'} /> } />
        <Route path='/login' element={ user ?  <MainBody /> : <Login />} />
        <Route path='/org/general' element={user ? <OrgSettings tabset={0} /> : <Navigate to={'/login'}/> } />
        <Route path='/org/teammates' element={user ? <OrgSettings tabset={1} /> : <Navigate to={'/login'}/> } />
        <Route path='/org/subscription' element={ user ? <OrgSettings tabset={2} /> : <Navigate to={'/login'}/>} />
        <Route path='/survey/global/settings/general' element={user ?  <SurveySettings tabset={0} /> : <Navigate to={'/login'}/> } />
        <Route path='/survey/global/settings/web' element={ user ? <SurveySettings tabset={1} /> : <Navigate to={'/login'}/> } />
        <Route path='/survey/detail/create/:surveyId' element={ user ? <CreateSurvey /> : <Navigate to={'/login'}/> } />
        <Route path='/survey/detail/design/:surveyId' element={user ? <DesignPreview /> : <Navigate to={'/login'}/> } />
        <Route path='/survey/detail/share/:surveyId' element={user ? <ShareSurvey />  : <Navigate to={'/login'}/>  } />
        <Route path='/survey/detail/analyze/:surveyId' element={ user ? <AnalyzeSurvey /> : <Navigate to={'/login'}/>   } />
        <Route path='/survey/detail/configure/:surveyId' element={ user ? <ConfigureSurvey /> : <Navigate to={'/login'}/>    } />
      </Routes>
    </div>
  );
}

export default App;
