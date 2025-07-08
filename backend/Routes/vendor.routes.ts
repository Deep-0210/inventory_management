import express from "express";
import { childVendorList, sendStockRequestMail, vendorRequestedData } from "../Controller/vendor.controller";

const vendorRoutes = express.Router();

vendorRoutes.get('/childVendors', childVendorList) // api for get the vendor list under the logIn user
vendorRoutes.post('/sendRequestMail', sendStockRequestMail) // api for send the request mail for the stock request
vendorRoutes.get('/vendorAllRequestData', vendorRequestedData)


export default vendorRoutes;