import express from 'express'
import { registrationOTP } from "../Controller/RegistrationOTP";
import { checkUserExist } from '../Controller/CheckUserExist';
import { checkRegistrationOTP } from '../Controller/CheckRegistrationOTP';
import { UserLogIn } from '../Controller/UserLogIn';

const route = express.Router();

route.post('/', checkUserExist)
route.post('/userRegistrationOTP', registrationOTP)
route.post('/checkRegistrationOTP', checkRegistrationOTP)
route.post('/userLogIn', UserLogIn)

export default route;