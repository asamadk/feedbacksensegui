import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import TypographyOverride from './Fonts/TypographyOverride';
import store from './Redux/store';
import { initMixpanel } from './Utils/Mixpanel';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store} >
      <BrowserRouter>
        <TypographyOverride />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
initMixpanel();
