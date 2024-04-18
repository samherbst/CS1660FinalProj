import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { BrowserRouter as Router } from 'react-router-dom';

const RouterComponent = () => {
  return (
    // <Routes>
    //     <h1>React App</h1>
    //   {/* <Route path="/" element={<Login />} /> */}
    // </Routes>
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            
        </Routes>
    </Router>
  );
};

export default RouterComponent;