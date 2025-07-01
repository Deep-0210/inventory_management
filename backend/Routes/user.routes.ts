import express from 'express'
import { checkUserExist } from '../Controller/CheckUserExist';
import { UserLogIn } from '../Controller/UserLogIn';
import { checkForgetPasswordOTP, generateForgetPasswordOTP, updateUserPassword } from '../Controller/ForgotPassword';
import { checkRegistrationOTP } from '../Controller/CheckRegistrationOTP';
import { deleteUserData, updateUserData } from '../Controller/VendorList';
import { registrationOTP } from '../Controller/RegistrationOTP';
import { logInUserData } from '../Controller/LogInUserData';
import { middleware } from '../Middleware/Middleware';

const userRoutes = express.Router();

userRoutes.post('/', checkUserExist) // api for check the user exist in db or not
userRoutes.post('/userLogIn', UserLogIn) // api for authenticate the user email and password and provide token
userRoutes.post('/generateForgotPasswordOTP', generateForgetPasswordOTP) // api for create and mail new otp for forget password
userRoutes.post('/checkForgetPasswordOTP', checkForgetPasswordOTP) // api for verify the otp 
userRoutes.put('/updateUserPassword', updateUserPassword) // api for validate new password and update new password in db

userRoutes.use(middleware) // function for authenticate the user for protected routs

userRoutes.post('/checkRegistrationOTP', checkRegistrationOTP) // api for check user otp and register user data
userRoutes.put('/updateUserData', updateUserData) // api for update user registration data
userRoutes.delete('/deleteUserData', deleteUserData) // api for delete user data
userRoutes.post('/userRegistrationOTP', registrationOTP) // api for create a otp for user registration
userRoutes.get('/logInUserData', logInUserData) // api for get the logIn user data

export default userRoutes;