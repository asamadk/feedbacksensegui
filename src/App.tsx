import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import SurveyThemeSelector from './Components/SurveyThemeSelector';
import AnalyzeSurvey from './Layout/AnalyzeSurvey';
import ConfigureSurvey from './Layout/ConfigureSurvey';
import CreateSurvey from './Layout/CreateSurvey';
import DesignPreview from './Layout/DesignPreview';
import MainBody from './Layout/MainBody';
import OrgSettings from './Layout/OrgSettings';
import ShareSurvey from './Layout/ShareSurvey';
import SurveySettings from './Layout/SurveySettings';

const globalBodyStyle = {
  backgroundColor: '#1E1E1E',
}

function App() {
  return (
    <div style={globalBodyStyle} className="App">
      <Header />
      <Routes>
        <Route path='/' element={<MainBody />} />
        <Route path='/org/general' element={<OrgSettings tabset={0} />} />
        <Route path='/org/teammates' element={<OrgSettings tabset={1} />} />
        <Route path='/org/subscription' element={<OrgSettings tabset={2} />} />
        <Route path='/survey/global/settings/general' element={<SurveySettings tabset={0} />} />
        <Route path='/survey/global/settings/web' element={<SurveySettings tabset={1} />} />
        <Route path='/survey/detail/create/:surveyId' element={<CreateSurvey />} />
        <Route path='/survey/detail/design' element={<DesignPreview />} />
        <Route path='/survey/detail/share' element={<ShareSurvey />} />
        <Route path='/survey/detail/analyze' element={<AnalyzeSurvey />} />
        <Route path='/survey/detail/configure' element={<ConfigureSurvey />} />
      </Routes>
    </div>
  );
}

export default App;
