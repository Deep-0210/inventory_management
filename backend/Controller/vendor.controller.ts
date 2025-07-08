import { Request, Response } from "express";
import { responseData, serverErrorMessage } from "../Utils/responseHandler";
import { childVendorListService, sendStockRequestMailService, vendorRequestedDataService } from "../services/vendor.service";

export const childVendorList = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const childVendorList = await childVendorListService(email);
        return responseData(res, childVendorList.status, childVendorList.message, childVendorList.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const sendStockRequestMail = async (req: Request, res: Response) => {
    try {
        const { productName, productPrice, productQuantity, email } = req.body;
        const isMailSent = await sendStockRequestMailService({ productName, productPrice, productQuantity, email });
        return responseData(res, isMailSent.status, isMailSent.message, isMailSent.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}

export const vendorRequestedData = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const allStockData = await vendorRequestedDataService(email);
        return responseData(res, allStockData.status, allStockData.message, allStockData.data);
    } catch (error) {
        serverErrorMessage(res);
    }
}