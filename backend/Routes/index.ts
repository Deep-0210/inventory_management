import express from 'express'
import { middleware } from '../Middleware/auth.middleware';
import vendorRoutes from './vendor.routes';
import stokeRoutes from './stoke.routes';
import userRoutes from './user.routes';

const route = express.Router();

route.use('/user', userRoutes); // route group for user routes

route.use(middleware) // function for authenticate the user for protected routs

route.use('/inventory', vendorRoutes); // route group for inventory related routes
route.use("/stock", stokeRoutes); // routes group for stock related routes

export default route;