import express from 'express'
import { registrationOTP } from "../Controller/RegistrationOTP";
import { checkUserExist } from '../Controller/CheckUserExist';
import { checkRegistrationOTP } from '../Controller/CheckRegistrationOTP';
import { UserLogIn } from '../Controller/UserLogIn';
import { middleware } from '../Middleware/Middleware';
import { addStock, getStockData, removeStockData, updateStockData } from '../Controller/AddStock';
import { checkForgetPasswordOTP, generateForgetPasswordOTP, updateUserPassword } from '../Controller/ForgotPassword';
import { logInUserData } from '../Controller/LogInUserData';
import { deleteUserData, getVendorList, updateUserData } from '../Controller/VendorList';
import { answerRequestedStock, getPendingStockRequestedData, getRespondedStockRequestedData, getUserStock, sendRequestMail } from '../Controller/StockRequest';

const route = express.Router();

route.post('/', checkUserExist) // api for check the user exist in db or not
route.post('/userLogIn', UserLogIn) // api for authenticate the user email and password and provide token
route.post('/generateForgotPasswordOTP', generateForgetPasswordOTP) // api for create and mail new otp for forget password
route.post('/checkForgetPasswordOTP', checkForgetPasswordOTP) // api for verify the otp 
route.put('/updateUserPassword', updateUserPassword) // api for validate new password and update new password in db

route.use(middleware) // function for authenticate the user for protected routs
route.post('/checkRegistrationOTP', checkRegistrationOTP) // api for check user otp and register user data
route.put('/updateUserData', updateUserData) // api for update user registration data
route.delete('/deleteUserData', deleteUserData) // api for delete user data
route.post('/userRegistrationOTP', registrationOTP) // api for create a otp for user registration
route.post('/addStock', addStock) // api for add the stock for user
route.get('/logInUserData', logInUserData) // api for get the logIn user data
route.get('/getVendorList', getVendorList) // api for get the vendor list under the logIn user
route.post('/addStock', addStock) // api for add stock for vendor
route.get('/getStockData', getStockData) // api for get the stock data as per the user
route.put('/updateStockData', updateStockData) // api for the update the stock data
route.delete('/removeStockData', removeStockData) // api for remove the stock data
route.get('/getUserStock', getUserStock) // api for get the stock for request
route.post('/sendRequestMail', sendRequestMail) // api for send the request mail for the stock request
route.put('/answerRequestedStock', answerRequestedStock) // api for update the requested stock
route.get('/getPendingStockRequestedData', getPendingStockRequestedData) // api for get the requested data
route.get('/getRespondedStockRequestedData', getRespondedStockRequestedData)

export default route;