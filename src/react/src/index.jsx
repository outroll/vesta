import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async';
import configureStore from './store';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './containers/App/serviceWorker';
import { BrowserRouter as Router } from 'react-router';

createRoot(document.getElementById('root')).render(
  <Provider store={configureStore()}>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
