import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 4000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <AlertProvider template={AlertTemplate} {...options}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AlertProvider>
);


reportWebVitals();
