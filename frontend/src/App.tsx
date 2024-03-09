import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogIn from './components/UserLogIn/UserLogIn';
import SignUp from './components/UserSignUp/SignUp';
import RegisterUserData from './components/UserRegistration/RegisterUserData';
import { UserProfileData, UserSignUp } from './Types/Types';
import CheckOTP from './components/CheckOTP/CheckOTP';
import UserMainPage from './components/UserMainPage/UserMainPage';

function App() {
   // Function to store userSignData
   const [userData, setUserData] = useState<UserSignUp[]>([])
   const registerData = (e: UserSignUp) => {
     setUserData((userData) => [...userData, e])
   }

     // Function to store userRegistration data
  const [ProfileData, setUserProfileData] = useState<UserProfileData[]>([])
  const userProfileData = (e: UserProfileData) => {
    setUserProfileData((ProfileData) => [...ProfileData, e])
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignUp registerData={registerData}/>} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/new/registration' element={<RegisterUserData userData={userData} userProfileData={userProfileData}/>} />
        <Route path='/verify-otp' element={<CheckOTP ProfileData={ProfileData} userData={userData} />} />
        <Route path='/user-page' element={<UserMainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
