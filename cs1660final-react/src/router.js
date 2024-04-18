import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';

const RouterComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default RouterComponent;