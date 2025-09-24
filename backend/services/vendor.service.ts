import { RequestedStock } from "../Models/stockRequest.model";
import { User } from "../Models/user.model";
import { SendStockData, StockType } from "../types/stock.type";
import { SendUser, UserServiceType } from "../types/user.types";
import { SendStockRequest } from "../View/sendStockRequest";
import { userMail } from "../services/mail.service";

export const childVendorListService = async (email: string): Promise<UserServiceType<Array<SendUser> | string>> => {
    try {
        const adminVendor = await User.findOne({ "email": email });

        if (!adminVendor) {
            return { status: 400, message: "Vendor data not found" };
        }

        const childVendors = await User.find({ "vendorRef": adminVendor?._id }).select({ vendorRef: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        return { status: 200, message: "Child vendor fetched successfully", data: childVendors };
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error as string };
    }
}

export const sendStockRequestMailService = async ({ productName, productPrice, productQuantity, email }: StockType): Promise<UserServiceType<string>> => {
    try {
        const userData = await User.findOne({ "email": email }).exec();

        if (!userData) {
            return { status: 400, message: "Vendor data not found" }
        }

        const requestVendorData = await User.findOne({ "_id": userData?.vendorRef });

        if (!requestVendorData) {
            return { status: 400, message: "Requested vendor data not found" }
        }

        const template = SendStockRequest(requestVendorData?.firstName, requestVendorData?.lastName, productName, productPrice, productQuantity);

        const mail = await userMail(requestVendorData?.email, userData?.email, template, `Stock request from ${userData?.firstName} ${userData?.lastName}`);

        if (!mail.response) {
            return { status: 500, message: "Fail to send the mail" }
        }

        return { status: 200, message: "Request sent successfully" }
    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error as string };
    }
}

export const vendorRequestedDataService = async (email: string): Promise<UserServiceType<Array<SendStockData> | string>> => {
    try {
        const userData = await User.findOne({ "email": email });

        if (!userData) {
            return { status: 400, message: "Vendor data not found" };
        }

        const stockHistory = await RequestedStock.find({ "requestedId": userData?._id }).select({ createdAt: 0, updatedAt: 0, __v: 0, requestedId: 0, attendantId: 0 });

        return { status: 200, message: "All stock data fetched successfully", data: stockHistory };

    } catch (error) {
        return { status: 500, message: "Internal Server Error", data: error as string };
    }
}