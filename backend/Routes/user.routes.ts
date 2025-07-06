import express from 'express'
import { checkForgetPasswordOtp, checkRegistrationOtp, checkUserExist, deleteUserData, generateForgetPasswordOTP, logInUserData, registrationOtp, updateUserData, updateUserPassword, userLogIn } from '../Controller/user.controller';
import { middleware } from '../Middleware/auth.middleware';

const userRoutes = express.Router();

userRoutes.post('/', checkUserExist) // api for check the user exist in db or not
userRoutes.post('/userLogIn', userLogIn) // api for authenticate the user email and password and provide token
userRoutes.post('/generateForgotPasswordOtp', generateForgetPasswordOTP) // api for create and mail new otp for forget password
userRoutes.post('/checkForgetPasswordOtp', checkForgetPasswordOtp) // api for verify the otp 
userRoutes.put('/updateUserPassword', updateUserPassword) // api for validate new password and update new password in db

userRoutes.use(middleware) // function for authenticate the user for protected routs

userRoutes.get('/logInUserData', logInUserData) // api for get the logIn user data
userRoutes.post('/userRegistrationOTP', registrationOtp) // api for create a otp for user registration
userRoutes.post('/checkRegistrationOTP', checkRegistrationOtp) // api for check user otp and register user data
userRoutes.put('/updateUserData', updateUserData) // api for update user registration data
userRoutes.delete('/deleteUserData', deleteUserData) // api for delete user data

export default userRoutes;