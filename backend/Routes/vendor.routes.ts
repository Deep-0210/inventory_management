import express from "express";
import { addStock, getStockData } from "../Controller/AddStock";
import { getVendorList } from "../Controller/VendorList";
import { getPendingStockRequestedData, getRespondedStockRequestedData, sendRequestMail, vendorAllRequestData } from "../Controller/StockRequest";

const vendorRoutes = express.Router();

vendorRoutes.get('/getVendorList', getVendorList) // api for get the vendor list under the logIn user
vendorRoutes.get('/getPendingStockRequestedData', getPendingStockRequestedData) // api for get the requested data
vendorRoutes.get('/getRespondedStockRequestedData', getRespondedStockRequestedData)

vendorRoutes.post('/sendRequestMail', sendRequestMail) // api for send the request mail for the stock request
vendorRoutes.get('/vendorAllRequestData', vendorAllRequestData)


export default vendorRoutes;