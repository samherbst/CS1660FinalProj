// modules
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

// components
import LoginPage from './components/LoginPage';
import Home from './components/Home';

const RouterComponent = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home/:username" element={<Home />} />
        </Routes>
    </Router>
  );
};

export default RouterComponent;