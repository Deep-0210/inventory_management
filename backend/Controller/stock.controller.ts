import { Request, Response } from "express";
import { responseData, serverErrorMessage } from "../Utils/responseHandler";
import { addStockService, getAdminStockService, getPendingStockRequestedDataService, getRespondedStockRequestedDataService, getStockService, removeStockDataService, respondRequestedStockService, updateStockService } from "../services/stock.service";

export const getStockData = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const stockData = await getStockService(email);
        return responseData(res, stockData.status, stockData.message, stockData.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getAdminStock = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const adminStock = await getAdminStockService(email);
        return responseData(res, adminStock.status, adminStock.message, adminStock.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getPendingStockRequestedData = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const pendingStockData = await getPendingStockRequestedDataService(email);

        return responseData(res, pendingStockData.status, pendingStockData.message, pendingStockData.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const getRespondedStockRequestedData = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const respondedData = await getRespondedStockRequestedDataService(email);
        return responseData(res, respondedData.status, respondedData.message, respondedData.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const addStock = async (req: Request, res: Response) => {
    try {
        const { productName, productQuantity, productPrice, email } = req.body;
        const newStock = await addStockService({ productName, productQuantity, productPrice, email });
        return responseData(res, newStock.status, newStock.message, newStock.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const updateStock = async (req: Request, res: Response) => {
    try {
        const { productName, productQuantity, productPrice, email, id } = req.body;
        const updatedStock = await updateStockService({ productName, productQuantity, productPrice, email, id });
        return responseData(res, updatedStock.status, updatedStock.message, updatedStock.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const respondRequestedStock = async (req: Request, res: Response) => {
    try {
        const { email, id, status } = req.body;
        const respondedStock = await respondRequestedStockService({ email, id, status });
        return responseData(res, respondedStock.status, respondedStock.message, respondedStock.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const removeStockData = async (req: Request, res: Response) => {
    try {
        const { email, id } = req.body;
        const deletedStock = await removeStockDataService({ email, id });
        return responseData(res, deletedStock.status, deletedStock.message, deletedStock.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}