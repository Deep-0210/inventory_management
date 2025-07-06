import express from 'express'
import { addStock, getStockData, removeStockData, updateStockData } from '../Controller/AddStock';
import { answerRequestedStock, getPendingStockRequestedData, getRespondedStockRequestedData, getUserStock } from '../Controller/StockRequest';

const stokeRoutes = express.Router();

stokeRoutes.get('/getStockData', getStockData) // api for get the stock data as per the user
stokeRoutes.get('/getUserStock', getUserStock) // api for get the stock for request
stokeRoutes.get('/getPendingStockRequestedData', getPendingStockRequestedData) // api for get the requested data
stokeRoutes.get('/getRespondedStockRequestedData', getRespondedStockRequestedData)
stokeRoutes.post('/addStock', addStock) // api for add the stock for user
stokeRoutes.put('/updateStockData', updateStockData) // api for the update the stock data
stokeRoutes.put('/answerRequestedStock', answerRequestedStock) // api for update the requested stock
stokeRoutes.delete('/removeStockData', removeStockData) // api for remove the stock data

export default stokeRoutes;