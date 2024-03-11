import express from 'express'
import { registrationOTP } from "../Controller/RegistrationOTP";
import { checkUserExist } from '../Controller/CheckUserExist';
import { checkRegistrationOTP } from '../Controller/CheckRegistrationOTP';
import { UserLogIn } from '../Controller/UserLogIn';
import { middleware } from '../Middleware/Middleware';
import { addStock } from '../Controller/AddStock';
import { checkForgetPasswordOTP, generateForgetPasswordOTP, updateUserPassword } from '../Controller/ForgotPasswoed';

const route = express.Router();

route.post('/', checkUserExist)
route.post('/userRegistrationOTP', registrationOTP)
route.post('/checkRegistrationOTP', checkRegistrationOTP)
route.post('/userLogIn', UserLogIn)
route.post('/generateForgotPasswordOTP', generateForgetPasswordOTP)
route.post('/checkForgetPasswordOTP', checkForgetPasswordOTP)
route.put('/updateUserPassword', updateUserPassword)

route.use(middleware)
route.post('/addStock', addStock)

export default route;