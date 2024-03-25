import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/UserLogIn/UserLogIn';
import UserMainPage from './components/UserMainPage/UserMainPage';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import VendorList from './components/UserMainPage/VendorList';
import AddStock from './components/UserMainPage/AddStock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LogIn />} />
        <Route path='/user-page' element={<UserMainPage />} />
        <Route path='/forget-password' element={<ForgotPassword />} />
        <Route path='/vendor-list' element={<VendorList />} />
        <Route path='/add-stock' element={<AddStock />} />
      </Routes>
    </Router>
  );
}

export default App;
