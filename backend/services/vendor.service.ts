import { userRequestedStock } from "../Models/stockRequest.model";
import { userRegisterModel } from "../Models/user.model";
import { StockType } from "../types/stock.type";
import { UserServiceType } from "../types/user.types";
import { userMail } from "../services/mail.service";
import { SendStockRequest } from "../View/sendStockRequest";

export const childVendorListService = async (email: string): Promise<UserServiceType> => {
    try {
        const adminVendor = await userRegisterModel.findOne({ "email": email });

        if (!adminVendor) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const childVendors = await userRegisterModel.find({ "vendorRef": adminVendor?._id }).select({ vendorRef: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        return { status: 200, message: "Child vendor fetched successfully", data: childVendors };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const sendStockRequestMailService = async ({ productName, productPrice, productQuantity, email }: StockType): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email }).exec();

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null }
        }

        const requestVendorData = await userRegisterModel.findOne({ "_id": userData?.vendorRef });

        if (!requestVendorData) {
            return { status: 400, message: "Requested vendor data not found", data: null }
        }

        const template = SendStockRequest(requestVendorData?.firstName, requestVendorData?.lastName, productName, productPrice, productQuantity);

        const mail = await userMail(requestVendorData?.email as string, userData?.email, template, `Stock request from ${userData?.firstName} ${userData?.lastName}`);

        if (!mail.response) {
            return { status: 500, message: "Fail to send the mail", data: null }
        }

        return { status: 200, message: "Request sent successfully", data: null }
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}

export const vendorRequestedDataService = async (email: string): Promise<UserServiceType> => {
    try {
        const userData = await userRegisterModel.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found", data: null };
        }

        const stockHistory = await userRequestedStock.find({ "requestedId": userData?._id }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

        return { status: 200, message: "All stock data fetched successfully", data: stockHistory };

    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error };
    }
}