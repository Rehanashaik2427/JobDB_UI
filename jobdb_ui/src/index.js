// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './dashboard.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './styles/app/app.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
