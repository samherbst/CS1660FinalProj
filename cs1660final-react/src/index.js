// modules
import React from 'react';
import ReactDOM from 'react-dom';

// components
import RouterComponent from './router';
import Header from './components/Header';

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <RouterComponent />
  </React.StrictMode>,
  document.getElementById('root')
);