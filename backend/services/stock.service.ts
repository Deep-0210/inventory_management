import { addNewStock } from "../Models/stock.model";
import { userRequestedStock } from "../Models/stockRequest.model";
import { userRegisterModel } from "../Models/user.model";
import { StockType } from "../types/stock.type";
import { UserServiceType } from "../types/user.types";
import { userMail } from "../services/mail.service";
import { validateAddStockData } from "../Validation/ValidateNewStockData";
import { SendStockResponse } from "../View/sendStockResponse";

export const getStockService = async (email: string): Promise<UserServiceType> => {
    try {
        const vendorData = await userRegisterModel.findOne({ email });

        if (!vendorData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const stockData = await addNewStock.find({ "vendorId": vendorData?._id }).select({ vendorId: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        return { status: 200, message: "Stock data fetched successfully", data: stockData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const getAdminStockService = async (email: string): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ email }).exec();

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const stockData = await addNewStock.find({ "vendorId": userData?.vendorRef }).select({ vendorId: 0, createdAt: 0, updatedAt: 0, __v: 0 });

        return { status: 200, message: "Admin stock data fetched successfully", data: stockData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const getPendingStockRequestedDataService = async (email: string): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const requestedData = await userRequestedStock.find({ "attendantId": userData?._id, "status": "pending" }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

        return { status: 200, message: "Pending Stock Data", data: requestedData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const getRespondedStockRequestedDataService = async (email: string): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const respondedData = await userRequestedStock.find({ "attendantId": userData?._id, status: { $in: ["Accepted", "Rejected"] } }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

        return { status: 200, message: "Responded Stock Data", data: respondedData };

    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const addStockService = async ({ email, productName, productQuantity, productPrice }: StockType): Promise<UserServiceType> => {
    try {

        const isValidStockData = validateAddStockData({ productName, productQuantity, productPrice });

        if (isValidStockData.error) {
            return { status: 400, message: isValidStockData.error.details[0].message, data: null };
        }

        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const saveStockData = new addNewStock({ productName, productPrice, productQuantity, vendorId: userData?._id });
        await saveStockData.save();

        return { status: 200, message: "Stock added successfully", data: null };

    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const updateStockService = async ({ email, productName, productQuantity, productPrice, id }: StockType & { id: string }): Promise<UserServiceType> => {
    try {
        const isValidStockData = validateAddStockData({ productName, productQuantity, productPrice });

        if (isValidStockData.error) {
            return { status: 400, message: isValidStockData.error.details[0].message, data: null };
        }

        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const updatedStockData = await addNewStock.findByIdAndUpdate(id, { productName, productPrice, productQuantity }, { new: true });
        return { status: 200, message: "Stock updated successfully", data: updatedStockData };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const respondRequestedStockService = async ({ email, id, status }: { email: string, id: string, status: string }): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const requestedData = await userRequestedStock.findOne({ "_id": id });

        if (!requestedData) {
            return { status: 400, message: "Stock data not found", data: null };
        }

        const subUserData = await userRegisterModel.findOne({ "_id": requestedData?.requestedId });

        if (!subUserData) {
            return { status: 400, message: "Requested user not found", data: null };
        }

        const template = SendStockResponse(subUserData?.firstName, subUserData?.lastName, requestedData?.productName, requestedData?.productPrice, requestedData?.productQuantity, status + 'ed');

        const mail = await userMail(subUserData?.email, userData?.email, template, `Stock response from ${userData?.firstName} ${userData?.lastName}`);

        if (!mail.response) {
            return { status: 500, message: "Fail to send message", data: null };
        }

        const respondedData = new userRequestedStock({
            requestedId: requestedData?.requestedId?.toString(),
            attendantId: requestedData?.attendantId?.toString(),
            productName: requestedData?.productName,
            productPrice: requestedData?.productPrice,
            productQuantity: requestedData?.productQuantity,
            status: status + 'ed'
        });

        await respondedData.save();
        return { status: 200, message: "Stock request sent successfully", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const removeStockDataService = async ({ email, id }: { email: string, id: string }): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        await addNewStock.findByIdAndDelete({ "_id": id });
        return { status: 200, message: "Stock deleted successfully", data: null };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}