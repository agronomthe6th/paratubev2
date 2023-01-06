import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import en from 'javascript-time-ago/locale/en';
import TimeAgo from 'javascript-time-ago';
import { PersistGate } from 'redux-persist/integration/react';
// import cstore, { persistor } from './store/store';
import store from './store/store'; 
import {Helmet} from "react-helmet";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store}>
  <Helmet>
    <title>Paratube</title>
  </Helmet>

    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

