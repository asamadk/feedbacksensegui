import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import Header from './Components/Header';
import MainBody from './Layout/MainBody';
import OrgSettings from './Layout/OrgSettings';
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
      </Routes>
    </div>
  );
}

export default App;
