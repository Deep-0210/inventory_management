import express from 'express'
import { addStock, getAdminStock, getPendingStockRequestedData, getRespondedStockRequestedData, getStockData, removeStockData, respondRequestedStock, updateStock } from '../Controller/stock.controller';

const stokeRoutes = express.Router();

stokeRoutes.get('/userStock', getStockData) // api for get the stock data as per the user
stokeRoutes.get('/adminStock', getAdminStock) // api for get the stock from admin
stokeRoutes.get('/pendingStock', getPendingStockRequestedData) // api for get the requested data
stokeRoutes.get('/respondedStock', getRespondedStockRequestedData)
stokeRoutes.post('/addStock', addStock) // api for add the stock for user
stokeRoutes.put('/updateStock', updateStock) // api for the update the stock data
stokeRoutes.put('/respondRequestedStock', respondRequestedStock) // api for update the requested stock
stokeRoutes.delete('/removeStockData', removeStockData) // api for remove the stock data

export default stokeRoutes;